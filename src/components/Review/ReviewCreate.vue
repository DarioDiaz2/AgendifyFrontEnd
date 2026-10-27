<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Resena' : 'Nueva Resena' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-select
          v-model="form.clientId"
          :options="clientes"
          label="Cliente"
          outlined
          emit-value
          map-options
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number | null) => !!v || 'Selecciona el cliente']"
        />
        <q-select
          v-model="form.barberId"
          :options="barberos"
          label="Barbero"
          outlined
          emit-value
          map-options
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number | null) => !!v || 'Selecciona el barbero']"
        />
        <q-input
          v-model="form.comment"
          label="Comentario"
          type="textarea"
          outlined
          autogrow
          class="q-mb-sm"
          :maxlength="500"
          counter
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="reviewStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useReviewStore } from 'stores/review';
import { useClientStore } from 'stores/client';
import { useBarberStore } from 'stores/barber';
import type { ReviewRequestDto } from 'src/models/Review/ReviewRequestDto';
import { notificarError } from 'src/utils/notificar';


const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const reviewStore = useReviewStore();
const clientStore = useClientStore();
const barberStore = useBarberStore();
const formRef = ref<QForm | null>(null);


const form = ref<Omit<ReviewRequestDto, 'clientId' | 'barberId'> & {
  clientId: number | null
  barberId: number | null
}>({
  clientId: null,
  barberId: null,
  comment: '',
});


const clientes = computed(() =>
  clientStore.clients.map((c) => ({ label: c.fullName, value: c.id })),
);
const barberos = computed(() =>
  barberStore.barbers.map((b) => ({ label: b.fullName, value: b.id })),
);


onMounted(async () => {
  await Promise.all([clientStore.fetchAll(), barberStore.fetchAll()]);
  if (props.editId) {
    const review = await reviewStore.fetchById(props.editId);
    if (review) {
      form.value = {
        clientId: review.clientId,
        barberId: review.barberId,
        comment: review.comment,
      };
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  const dto: ReviewRequestDto = {
    clientId: form.value.clientId as number,
    barberId: form.value.barberId as number,
    comment: form.value.comment,
  };
  try {
    if (props.editId) {
      await reviewStore.update(props.editId, dto);
    } else {
      await reviewStore.create(dto);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar la resena');
  }
}
</script>
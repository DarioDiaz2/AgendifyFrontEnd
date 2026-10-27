<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Barbero' : 'Nuevo Barbero' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model="form.fullName"
          label="Nombre completo"
          outlined
          class="q-mb-sm"
          :maxlength="100"
          counter
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el nombre completo']"
        />
        <q-input
          v-model="form.specialty"
          label="Especialidad"
          outlined
          class="q-mb-sm"
          :maxlength="100"
          counter
        />
        <q-input
          v-model="form.phone"
          label="Telefono"
          outlined
          class="q-mb-sm"
          :maxlength="20"
          counter
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="barberStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useBarberStore } from 'stores/barber';
import type { BarberRequestDto } from 'src/models/Barber/BarberRequestDto';
import { notificarError } from 'src/utils/notificar';


const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const barberStore = useBarberStore();
const formRef = ref<QForm | null>(null);


const form = ref<BarberRequestDto>({
  fullName: '',
  specialty: '',
  phone: '',
});


onMounted(async () => {
  if (props.editId) {
    const barber = await barberStore.fetchById(props.editId);
    if (barber) {
      form.value = {
        fullName: barber.fullName,
        specialty: barber.specialty,
        phone: barber.phone,
      };
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  try {
    if (props.editId) {
      await barberStore.update(props.editId, form.value);
    } else {
      await barberStore.create(form.value);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el barbero');
  }
}
</script>
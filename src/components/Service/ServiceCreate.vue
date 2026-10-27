<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Servicio' : 'Nuevo Servicio' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model="form.name"
          label="Nombre"
          outlined
          class="q-mb-sm"
          :maxlength="100"
          counter
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el nombre']"
        />
        <q-input
          v-model.number="form.price"
          label="Precio"
          type="number"
          step="0.01"
          outlined
          prefix="$"
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => (v !== null && v >= 0) || 'Ingresa un precio valido']"
        />
        <q-input
          v-model.number="form.durationMinutes"
          label="Duracion (minutos)"
          type="number"
          step="1"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[
            (v: number) => (Number.isInteger(v) && v >= 1 && v <= 1440) || 'Ingresa una duracion entre 1 y 1440',
          ]"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="serviceStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useServiceStore } from 'stores/service';
import type { ServiceRequestDto } from 'src/models/Service/ServiceRequestDto';
import { notificarError } from 'src/utils/notificar';


const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const serviceStore = useServiceStore();
const formRef = ref<QForm | null>(null);


const form = ref<ServiceRequestDto>({
  name: '',
  price: 0,
  durationMinutes: 30,
});


onMounted(async () => {
  if (props.editId) {
    const service = await serviceStore.fetchById(props.editId);
    if (service) {
      form.value = {
        name: service.name,
        price: service.price,
        durationMinutes: service.durationMinutes,
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
      await serviceStore.update(props.editId, form.value);
    } else {
      await serviceStore.create(form.value);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el servicio');
  }
}
</script>
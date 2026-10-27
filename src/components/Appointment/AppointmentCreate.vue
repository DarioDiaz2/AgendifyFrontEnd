<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Cita' : 'Nueva Cita' }}</div>
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
          v-model="form.date"
          label="Fecha y hora"
          type="datetime-local"
          outlined
          stack-label
          class="q-mb-sm"
          lazy-rules
          :rules="[
            (v: string) => !!v || 'Ingresa la fecha y hora',
            (v: string) => fechaValida(v) || 'La fecha no puede ser anterior a la actual',
          ]"
        />
        <q-input
          v-model="form.notes"
          label="Notas"
          type="textarea"
          outlined
          autogrow
          class="q-mb-sm"
          :maxlength="500"
          counter
        />
        <q-input
          v-model.number="form.total"
          label="Total"
          type="number"
          outlined
          prefix="$"
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => (v !== null && v >= 0) || 'Ingresa un total valido']"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="appointmentStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useAppointmentStore } from 'stores/appointment';
import { useClientStore } from 'stores/client';
import { useBarberStore } from 'stores/barber';
import type { AppointmentRequestDto } from 'src/models/Appointment/AppointmentRequestDto';
import { notificarError } from 'src/utils/notificar';


const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const appointmentStore = useAppointmentStore();
const clientStore = useClientStore();
const barberStore = useBarberStore();
const formRef = ref<QForm | null>(null);


const form = ref<Omit<AppointmentRequestDto, 'clientId' | 'barberId'> & {
  clientId: number | null
  barberId: number | null
}>({
  clientId: null,
  barberId: null,
  date: '',
  notes: '',
  total: 0,
});


const fechaOriginal = ref<string | null>(null);


function fechaValida(v: string): boolean {
  if (!v) return true; // el "obligatorio" ya lo avisa la otra regla
  if (props.editId && v === fechaOriginal.value) return true;

  return new Date(v).getTime() >= Date.now() - 60_000;
}


const clientes = computed(() =>
  clientStore.clients.map((c) => ({ label: c.fullName, value: c.id })),
);
const barberos = computed(() =>
  barberStore.barbers.map((b) => ({ label: b.fullName, value: b.id })),
);


onMounted(async () => {
  await Promise.all([clientStore.fetchAll(), barberStore.fetchAll()]);
  if (props.editId) {
    const cita = await appointmentStore.fetchById(props.editId);
    if (cita) {
      form.value = {
        clientId: cita.clientId,
        barberId: cita.barberId,
        // datetime-local espera yyyy-MM-ddTHH:mm
        date: cita.date.slice(0, 16),
        notes: cita.notes,
        total: cita.total,
      };
      fechaOriginal.value = form.value.date;
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  const dto: AppointmentRequestDto = {
    clientId: form.value.clientId as number,
    barberId: form.value.barberId as number,
    date: form.value.date,
    notes: form.value.notes,
    total: form.value.total,
  };
  try {
    if (props.editId) {
      await appointmentStore.update(props.editId, dto);
    } else {
      await appointmentStore.create(dto);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar la cita');
  }
}
</script>
<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Pago' : 'Nuevo Pago' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-select
          v-model="form.appointmentId"
          :options="citas"
          label="Cita"
          outlined
          emit-value
          map-options
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number | null) => !!v || 'Selecciona la cita']"
        />
        <q-input
          v-model.number="form.amount"
          label="Monto"
          type="number"
          step="0.01"
          outlined
          prefix="$"
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => (v !== null && v > 0) || 'Ingresa un monto mayor a 0']"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="paymentStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { usePaymentStore } from 'stores/payment';
import { useAppointmentStore } from 'stores/appointment';
import type { PaymentRequestDto } from 'src/models/Payment/PaymentRequestDto';
import { notificarError } from 'src/utils/notificar';
import { formatFecha } from 'src/utils/formato';

// editId null = alta; con numero = modificacion
const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const paymentStore = usePaymentStore();
const appointmentStore = useAppointmentStore();
const formRef = ref<QForm | null>(null);

// Mismo DTO que viaja a la API, pero con el select vacio al iniciar
const form = ref<Omit<PaymentRequestDto, 'appointmentId'> & { appointmentId: number | null }>({
  appointmentId: null,
  amount: 0,
});

// Opciones del select: se arman con la lista de citas (ej: "#3 - Juan Perez - 25/10/2026 15:30")
const citas = computed(() =>
  appointmentStore.appointments.map((a) => ({
    label: `#${a.id} - ${a.clientName ?? 'Sin cliente'} - ${formatFecha(a.date)}`,
    value: a.id,
  })),
);

// Se carga la lista de citas y, si es modificacion, los datos actuales del pago
onMounted(async () => {
  await appointmentStore.fetchAll();
  if (props.editId) {
    const payment = await paymentStore.fetchById(props.editId);
    if (payment) {
      form.value = {
        appointmentId: payment.appointmentId,
        amount: payment.amount,
      };
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  const dto: PaymentRequestDto = {
    appointmentId: form.value.appointmentId as number,
    amount: form.value.amount,
  };
  try {
    if (props.editId) {
      await paymentStore.update(props.editId, dto);
    } else {
      await paymentStore.create(dto);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el pago');
  }
}
</script>
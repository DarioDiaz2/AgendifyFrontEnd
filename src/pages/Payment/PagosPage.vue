<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Pagos</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn flat round icon="refresh" :loading="paymentStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="paymentStore.payments"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="paymentStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay pagos para mostrar"
          loading-label="Cargando pagos..."
        />
      </q-card-section>

      <q-banner v-if="paymentStore.error" class="bg-negative text-white" rounded>
        {{ paymentStore.error }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { usePaymentStore } from 'stores/payment';
import type { PaymentResponseDto } from 'src/models/Payment/PaymentResponseDto';
import { formatFecha, formatMoneda } from 'src/utils/formato';

const paymentStore = usePaymentStore();

const filtro = ref('');

const columns: QTableColumn<PaymentResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'appointmentId', label: 'Cita', field: 'appointmentId', align: 'left', sortable: true },
  { name: 'amount', label: 'Monto', field: 'amount', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
  { name: 'paymentDate', label: 'Fecha de pago', field: 'paymentDate', align: 'center', sortable: true, format: (val: string) => formatFecha(val) },
];

function recargar() {
  void paymentStore.fetchAll();
}

onMounted(() => {
  recargar();
});
</script>

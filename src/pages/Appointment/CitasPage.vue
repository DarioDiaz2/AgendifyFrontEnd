<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Citas</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn flat round icon="refresh" :loading="appointmentStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="appointmentStore.appointments"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="appointmentStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay citas para mostrar"
          loading-label="Cargando citas..."
        />
      </q-card-section>

      <q-banner v-if="appointmentStore.error" class="bg-negative text-white" rounded>
        {{ appointmentStore.error }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useAppointmentStore } from 'stores/appointment';
import type { AppointmentResponseDto } from 'src/models/Appointment/AppointmentResponseDto';
import { formatFecha, formatMoneda } from 'src/utils/formato';

const appointmentStore = useAppointmentStore();

const filtro = ref('');

const columns: QTableColumn<AppointmentResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'clientName', label: 'Cliente', field: 'clientName', align: 'left', sortable: true },
  { name: 'barberName', label: 'Barbero', field: 'barberName', align: 'left', sortable: true },
  { name: 'date', label: 'Fecha', field: 'date', align: 'center', sortable: true, format: (val: string) => formatFecha(val) },
  { name: 'notes', label: 'Notas', field: 'notes', align: 'left', sortable: true },
  { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
];

function recargar() {
  void appointmentStore.fetchAll();
}

onMounted(() => {
  recargar();
});
</script>

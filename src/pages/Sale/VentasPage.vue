<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Ventas</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn flat round icon="refresh" :loading="saleStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="saleStore.sales"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="saleStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay ventas para mostrar"
          loading-label="Cargando ventas..."
        />
      </q-card-section>

      <q-banner v-if="saleStore.error" class="bg-negative text-white" rounded>
        {{ saleStore.error }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useSaleStore } from 'stores/sale';
import type { SaleResponseDto } from 'src/models/Sale/SaleResponseDto';
import { formatFecha, formatMoneda } from 'src/utils/formato';

const saleStore = useSaleStore();

const filtro = ref('');

const columns: QTableColumn<SaleResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'clientId', label: 'Cliente', field: 'clientId', align: 'left', sortable: true },
  { name: 'saleDate', label: 'Fecha de venta', field: 'saleDate', align: 'center', sortable: true, format: (val: string) => formatFecha(val) },
  { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
];

function recargar() {
  void saleStore.fetchAll();
}

onMounted(() => {
  recargar();
});
</script>

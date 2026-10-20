<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Detalles de venta</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn flat round icon="refresh" :loading="saleDetailStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="saleDetailStore.saleDetails"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="saleDetailStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay detalles de venta para mostrar"
          loading-label="Cargando detalles de venta..."
        />
      </q-card-section>

      <q-banner v-if="saleDetailStore.error" class="bg-negative text-white" rounded>
        {{ saleDetailStore.error }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useSaleDetailStore } from 'stores/saleDetail';
import type { SaleDetailResponseDto } from 'src/models/SaleDetail/SaleDetailResponseDto';
import { formatMoneda } from 'src/utils/formato';

const saleDetailStore = useSaleDetailStore();

const filtro = ref('');

const columns: QTableColumn<SaleDetailResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'saleId', label: 'Venta', field: 'saleId', align: 'left', sortable: true },
  { name: 'productId', label: 'Producto', field: 'productId', align: 'left', sortable: true },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'left', sortable: true },
  { name: 'unitPrice', label: 'Precio unitario', field: 'unitPrice', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
  { name: 'subTotal', label: 'Subtotal', field: 'subTotal', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
];

function recargar() {
  void saleDetailStore.fetchAll();
}

onMounted(() => {
  recargar();
});
</script>

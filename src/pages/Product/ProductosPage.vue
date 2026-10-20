<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Productos</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn flat round icon="refresh" :loading="productStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="productStore.products"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="productStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay productos para mostrar"
          loading-label="Cargando productos..."
        />
      </q-card-section>

      <q-banner v-if="productStore.error" class="bg-negative text-white" rounded>
        {{ productStore.error }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useProductStore } from 'stores/product';
import type { ProductResponseDto } from 'src/models/Product/ProductResponseDto';
import { formatMoneda } from 'src/utils/formato';

const productStore = useProductStore();

const filtro = ref('');

const columns: QTableColumn<ProductResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'price', label: 'Precio', field: 'price', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'left', sortable: true },
  { name: 'active', label: 'Activo', field: 'active', align: 'center', sortable: true, format: (val: boolean) => (val ? 'Si' : 'No') },
];

function recargar() {
  void productStore.fetchAll();
}

onMounted(() => {
  recargar();
});
</script>

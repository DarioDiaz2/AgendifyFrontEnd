<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Servicios</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn flat round icon="refresh" :loading="serviceStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="serviceStore.services"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="serviceStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay servicios para mostrar"
          loading-label="Cargando servicios..."
        />
      </q-card-section>

      <q-banner v-if="serviceStore.error" class="bg-negative text-white" rounded>
        {{ serviceStore.error }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useServiceStore } from 'stores/service';
import type { ServiceResponseDto } from 'src/models/Service/ServiceResponseDto';

const serviceStore = useServiceStore();

const filtro = ref('');

const columns: QTableColumn<ServiceResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
];

function recargar() {
  void serviceStore.fetchAll();
}

onMounted(() => {
  recargar();
});
</script>

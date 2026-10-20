<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Clientes</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn flat round icon="refresh" :loading="clientStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="clientStore.clients"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="clientStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay clientes para mostrar"
          loading-label="Cargando clientes..."
        />
      </q-card-section>

      <q-banner v-if="clientStore.error" class="bg-negative text-white" rounded>
        {{ clientStore.error }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useClientStore } from 'stores/client';
import type { ClientResponseDto } from 'src/models/Client/ClientResponseDto';
import { formatFecha } from 'src/utils/formato';

const clientStore = useClientStore();

const filtro = ref('');

const columns: QTableColumn<ClientResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'fullName', label: 'Nombre completo', field: 'fullName', align: 'left', sortable: true },
  { name: 'phone', label: 'Telefono', field: 'phone', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'createdDate', label: 'Fecha de alta', field: 'createdDate', align: 'center', sortable: true, format: (val: string) => formatFecha(val) },
];

function recargar() {
  void clientStore.fetchAll();
}

onMounted(() => {
  recargar();
});
</script>

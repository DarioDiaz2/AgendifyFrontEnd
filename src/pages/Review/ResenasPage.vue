<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Resenas</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn flat round icon="refresh" :loading="reviewStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="reviewStore.reviews"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="reviewStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay resenas para mostrar"
          loading-label="Cargando resenas..."
        />
      </q-card-section>

      <q-banner v-if="reviewStore.error" class="bg-negative text-white" rounded>
        {{ reviewStore.error }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useReviewStore } from 'stores/review';
import type { ReviewResponseDto } from 'src/models/Review/ReviewResponseDto';
import { formatFecha } from 'src/utils/formato';

const reviewStore = useReviewStore();

const filtro = ref('');

const columns: QTableColumn<ReviewResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'clientId', label: 'Cliente', field: 'clientId', align: 'left', sortable: true },
  { name: 'barberId', label: 'Barbero', field: 'barberId', align: 'left', sortable: true },
  { name: 'comment', label: 'Comentario', field: 'comment', align: 'left', sortable: true },
  { name: 'reviewDate', label: 'Fecha', field: 'reviewDate', align: 'center', sortable: true, format: (val: string) => formatFecha(val) },
];

function recargar() {
  void reviewStore.fetchAll();
}

onMounted(() => {
  recargar();
});
</script>

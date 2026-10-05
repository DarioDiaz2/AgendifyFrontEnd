<template>
  <q-page class="q-pa-md">
    <q-table
      title="Barberos"
      :rows="barberStore.barbers"
      :columns="columns"
      row-key="id"
      :loading="barberStore.loading"
      :rows-per-page-options="[10, 20, 50, 0]"
      no-data-label="No hay barberos para mostrar"
      loading-label="Cargando barberos..."
    >
      <template #top-right>
        <q-btn
          flat
          round
          icon="refresh"
          aria-label="Actualizar"
          :loading="barberStore.loading"
          @click="barberStore.fetchAll()"
        />
      </template>

      <template #body-cell-active="props">
        <q-td :props="props">
          <q-icon
            :name="props.row.active ? 'check_circle' : 'cancel'"
            :color="props.row.active ? 'positive' : 'negative'"
            size="sm"
          />
        </q-td>
      </template>
    </q-table>

    <q-banner v-if="barberStore.error" class="bg-negative text-white q-mt-md" rounded>
      {{ barberStore.error }}
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useBarberStore } from 'stores/barber';
import type { BarberResponseDto } from 'src/models/Barber/BarberResponseDto';

const barberStore = useBarberStore();

const columns: QTableColumn<BarberResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'fullName', label: 'Nombre completo', field: 'fullName', align: 'left', sortable: true },
  { name: 'specialty', label: 'Especialidad', field: 'specialty', align: 'left', sortable: true },
  { name: 'phone', label: 'Telefono', field: 'phone', align: 'left', sortable: true },
  { name: 'active', label: 'Activo', field: 'active', align: 'center', sortable: true },
];

onMounted(() => {
  void barberStore.fetchAll();
});
</script>

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
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nueva cita</q-tooltip>
        </q-btn>
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
        >
         
          <template #body-cell-acciones="props">
            <q-td class="text-right">
              <q-btn dense flat color="primary" icon="edit" @click="abrirEdicion(props.row.id)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn dense flat color="negative" icon="delete" @click="confirmarBaja(props.row.id)">
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-banner v-if="appointmentStore.error" class="bg-negative text-white" rounded>
        {{ appointmentStore.error }}
      </q-banner>
    </q-card>

   
    <q-dialog v-model="mostrarFormulario">
      <AppointmentCreate :edit-id="editId" @close="cerrarFormulario" />
    </q-dialog>

   
    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar</span>
        </q-card-section>
        <q-card-section>Se va a eliminar la cita. Esta accion no se puede deshacer.</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="eliminar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useAppointmentStore } from 'stores/appointment';
import type { AppointmentResponseDto } from 'src/models/Appointment/AppointmentResponseDto';
import AppointmentCreate from 'src/components/Appointment/AppointmentCreate.vue';
import { notificarError } from 'src/utils/notificar';
import { formatFecha, formatMoneda } from 'src/utils/formato';

const appointmentStore = useAppointmentStore();

const filtro = ref('');
const mostrarFormulario = ref(false);
const editId = ref<number | null>(null);
const confirmandoBaja = ref(false);
const idABorrar = ref<number | null>(null);

const columns: QTableColumn<AppointmentResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'clientName', label: 'Cliente', field: 'clientName', align: 'left', sortable: true },
  { name: 'barberName', label: 'Barbero', field: 'barberName', align: 'left', sortable: true },
  { name: 'date', label: 'Fecha', field: 'date', align: 'center', sortable: true, format: (val: string) => formatFecha(val) },
  { name: 'notes', label: 'Notas', field: 'notes', align: 'left', sortable: true },
  { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right', sortable: false },
];

function recargar() {
  void appointmentStore.fetchAll();
}

function abrirAlta() {
  editId.value = null;
  mostrarFormulario.value = true;
}

function abrirEdicion(id: number) {
  editId.value = id;
  mostrarFormulario.value = true;
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
  recargar();
}

function confirmarBaja(id: number) {
  idABorrar.value = id;
  confirmandoBaja.value = true;
}

async function eliminar() {
  try {
    if (idABorrar.value !== null) {
      await appointmentStore.borrar(idABorrar.value);
    }
  } catch {
    notificarError('No se pudo eliminar la cita');
  } finally {
    confirmandoBaja.value = false;
    recargar();
  }
}

onMounted(() => {
  recargar();
});
</script>
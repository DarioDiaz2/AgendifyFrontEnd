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
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nuevo servicio</q-tooltip>
        </q-btn>
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
        >
          <!-- Columna de acciones: un boton por cada operacion del ABM -->
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

      <q-banner v-if="serviceStore.error" class="bg-negative text-white" rounded>
        {{ serviceStore.error }}
      </q-banner>
    </q-card>

    
    <q-dialog v-model="mostrarFormulario">
      <ServiceCreate :edit-id="editId" @close="cerrarFormulario" />
    </q-dialog>

    
    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar</span>
        </q-card-section>
        <q-card-section>Se va a eliminar el servicio. Esta accion no se puede deshacer.</q-card-section>
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
import { useServiceStore } from 'stores/service';
import type { ServiceResponseDto } from 'src/models/Service/ServiceResponseDto';
import ServiceCreate from 'src/components/Service/ServiceCreate.vue';
import { notificarError } from 'src/utils/notificar';
import { formatMoneda } from 'src/utils/formato';

const serviceStore = useServiceStore();

const filtro = ref('');
const mostrarFormulario = ref(false);
const editId = ref<number | null>(null);
const confirmandoBaja = ref(false);
const idABorrar = ref<number | null>(null);

const columns: QTableColumn<ServiceResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'price', label: 'Precio', field: 'price', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
  { name: 'durationMinutes', label: 'Duracion (min)', field: 'durationMinutes', align: 'left', sortable: true },
  { name: 'active', label: 'Activo', field: 'active', align: 'center', sortable: true, format: (val: boolean) => (val ? 'Si' : 'No') },
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right', sortable: false },
];

function recargar() {
  void serviceStore.fetchAll();
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
      await serviceStore.borrar(idABorrar.value);
    }
  } catch {
    notificarError('No se pudo eliminar el servicio');
  } finally {
    confirmandoBaja.value = false;
    recargar();
  }
}

onMounted(() => {
  recargar();
});
</script>
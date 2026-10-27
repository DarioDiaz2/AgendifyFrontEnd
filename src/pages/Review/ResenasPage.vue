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
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nueva resena</q-tooltip>
        </q-btn>
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

      <q-banner v-if="reviewStore.error" class="bg-negative text-white" rounded>
        {{ reviewStore.error }}
      </q-banner>
    </q-card>

    
    <q-dialog v-model="mostrarFormulario">
      <ReviewCreate :edit-id="editId" @close="cerrarFormulario" />
    </q-dialog>

    
    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar</span>
        </q-card-section>
        <q-card-section>Se va a eliminar la resena. Esta accion no se puede deshacer.</q-card-section>
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
import { useReviewStore } from 'stores/review';
import { useClientStore } from 'stores/client';
import { useBarberStore } from 'stores/barber';
import type { ReviewResponseDto } from 'src/models/Review/ReviewResponseDto';
import ReviewCreate from 'src/components/Review/ReviewCreate.vue';
import { notificarError } from 'src/utils/notificar';
import { formatFecha } from 'src/utils/formato';

const reviewStore = useReviewStore();
const clientStore = useClientStore();
const barberStore = useBarberStore();

const filtro = ref('');
const mostrarFormulario = ref(false);
const editId = ref<number | null>(null);
const confirmandoBaja = ref(false);
const idABorrar = ref<number | null>(null);


function nombreCliente(id: number): string {
  return clientStore.clients.find((c) => c.id === id)?.fullName ?? String(id);
}
function nombreBarbero(id: number): string {
  return barberStore.barbers.find((b) => b.id === id)?.fullName ?? String(id);
}

const columns: QTableColumn<ReviewResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'clientId', label: 'Cliente', field: 'clientId', align: 'left', sortable: true, format: (val: number) => nombreCliente(val) },
  { name: 'barberId', label: 'Barbero', field: 'barberId', align: 'left', sortable: true, format: (val: number) => nombreBarbero(val) },
  { name: 'comment', label: 'Comentario', field: 'comment', align: 'left', sortable: true },
  { name: 'reviewDate', label: 'Fecha', field: 'reviewDate', align: 'center', sortable: true, format: (val: string) => formatFecha(val) },
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right', sortable: false },
];

function recargar() {
  void reviewStore.fetchAll();
  void clientStore.fetchAll();
  void barberStore.fetchAll();
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
      await reviewStore.borrar(idABorrar.value);
    }
  } catch {
    notificarError('No se pudo eliminar la resena');
  } finally {
    confirmandoBaja.value = false;
    recargar();
  }
}

onMounted(() => {
  recargar();
});
</script>
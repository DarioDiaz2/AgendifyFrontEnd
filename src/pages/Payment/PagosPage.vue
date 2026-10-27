<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Pagos</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nuevo pago</q-tooltip>
        </q-btn>
        <q-btn flat round icon="refresh" :loading="paymentStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="paymentStore.payments"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="paymentStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay pagos para mostrar"
          loading-label="Cargando pagos..."
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

      <q-banner v-if="paymentStore.error" class="bg-negative text-white" rounded>
        {{ paymentStore.error }}
      </q-banner>
    </q-card>

    <!-- Alta y modificacion comparten el mismo formulario -->
    <q-dialog v-model="mostrarFormulario">
      <PaymentCreate :edit-id="editId" @close="cerrarFormulario" />
    </q-dialog>

    <!-- La baja siempre se confirma antes de ejecutarse -->
    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar</span>
        </q-card-section>
        <q-card-section>Se va a eliminar el pago. Esta accion no se puede deshacer.</q-card-section>
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
import { usePaymentStore } from 'stores/payment';
import { useAppointmentStore } from 'stores/appointment';
import type { PaymentResponseDto } from 'src/models/Payment/PaymentResponseDto';
import PaymentCreate from 'src/components/Payment/PaymentCreate.vue';
import { notificarError } from 'src/utils/notificar';
import { formatFecha, formatMoneda } from 'src/utils/formato';

const paymentStore = usePaymentStore();
const appointmentStore = useAppointmentStore();

const filtro = ref('');
const mostrarFormulario = ref(false);
const editId = ref<number | null>(null);
const confirmandoBaja = ref(false);
const idABorrar = ref<number | null>(null);

// La API devuelve solo el id de la cita; el detalle se busca en la lista de citas
function descripcionCita(id: number): string {
  const cita = appointmentStore.appointments.find((a) => a.id === id);
  return cita ? `#${cita.id} - ${cita.clientName ?? 'Sin cliente'} - ${formatFecha(cita.date)}` : `#${id}`;
}

const columns: QTableColumn<PaymentResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'appointmentId', label: 'Cita', field: 'appointmentId', align: 'left', sortable: true, format: (val: number) => descripcionCita(val) },
  { name: 'amount', label: 'Monto', field: 'amount', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
  { name: 'paymentDate', label: 'Fecha de pago', field: 'paymentDate', align: 'center', sortable: true, format: (val: string) => formatFecha(val) },
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right', sortable: false },
];

function recargar() {
  void paymentStore.fetchAll();
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
      await paymentStore.borrar(idABorrar.value);
    }
  } catch {
    notificarError('No se pudo eliminar el pago');
  } finally {
    confirmandoBaja.value = false;
    recargar();
  }
}

onMounted(() => {
  recargar();
});
</script>
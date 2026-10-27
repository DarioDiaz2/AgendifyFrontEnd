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
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nuevo detalle</q-tooltip>
        </q-btn>
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

      <q-banner v-if="saleDetailStore.error" class="bg-negative text-white" rounded>
        {{ saleDetailStore.error }}
      </q-banner>
    </q-card>

    <!-- Alta y modificacion comparten el mismo formulario -->
    <q-dialog v-model="mostrarFormulario">
      <SaleDetailCreate :edit-id="editId" @close="cerrarFormulario" />
    </q-dialog>

    <!-- La baja siempre se confirma antes de ejecutarse -->
    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar</span>
        </q-card-section>
        <q-card-section>Se va a eliminar el detalle de venta. Esta accion no se puede deshacer.</q-card-section>
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
import { useSaleDetailStore } from 'stores/saleDetail';
import { useProductStore } from 'stores/product';
import type { SaleDetailResponseDto } from 'src/models/SaleDetail/SaleDetailResponseDto';
import SaleDetailCreate from 'src/components/SaleDetail/SaleDetailCreate.vue';
import { notificarError } from 'src/utils/notificar';
import { formatMoneda } from 'src/utils/formato';

const saleDetailStore = useSaleDetailStore();
const productStore = useProductStore();

const filtro = ref('');
const mostrarFormulario = ref(false);
const editId = ref<number | null>(null);
const confirmandoBaja = ref(false);
const idABorrar = ref<number | null>(null);

// La API devuelve solo el id del producto; el nombre se busca en la lista de productos
function nombreProducto(id: number): string {
  return productStore.products.find((p) => p.id === id)?.name ?? String(id);
}

const columns: QTableColumn<SaleDetailResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'saleId', label: 'Venta', field: 'saleId', align: 'left', sortable: true, format: (val: number) => `#${val}` },
  { name: 'productId', label: 'Producto', field: 'productId', align: 'left', sortable: true, format: (val: number) => nombreProducto(val) },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'left', sortable: true },
  { name: 'unitPrice', label: 'Precio unitario', field: 'unitPrice', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
  { name: 'subTotal', label: 'Subtotal', field: 'subTotal', align: 'right', sortable: true, format: (val: number) => formatMoneda(val) },
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right', sortable: false },
];

function recargar() {
  void saleDetailStore.fetchAll();
  void productStore.fetchAll();
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
      await saleDetailStore.borrar(idABorrar.value);
    }
  } catch {
    notificarError('No se pudo eliminar el detalle de venta');
  } finally {
    confirmandoBaja.value = false;
    recargar();
  }
}

onMounted(() => {
  recargar();
});
</script>
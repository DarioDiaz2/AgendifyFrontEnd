<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Detalle de Venta' : 'Nuevo Detalle de Venta' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-select
          v-model="form.saleId"
          :options="ventas"
          label="Venta"
          outlined
          emit-value
          map-options
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number | null) => !!v || 'Selecciona la venta']"
        />
        <q-select
          v-model="form.productId"
          :options="productos"
          label="Producto"
          outlined
          emit-value
          map-options
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number | null) => !!v || 'Selecciona el producto']"
        />
        <q-input
          v-model.number="form.quantity"
          label="Cantidad"
          type="number"
          step="1"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => (Number.isInteger(v) && v >= 1) || 'Ingresa una cantidad entera mayor a 0']"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="saleDetailStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useSaleDetailStore } from 'stores/saleDetail';
import { useSaleStore } from 'stores/sale';
import { useProductStore } from 'stores/product';
import { useClientStore } from 'stores/client';
import type { SaleDetailRequestDto } from 'src/models/SaleDetail/SaleDetailRequestDto';
import { notificarError } from 'src/utils/notificar';
import { formatFecha, formatMoneda } from 'src/utils/formato';


const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const saleDetailStore = useSaleDetailStore();
const saleStore = useSaleStore();
const productStore = useProductStore();
const clientStore = useClientStore();
const formRef = ref<QForm | null>(null);


const form = ref<Omit<SaleDetailRequestDto, 'saleId' | 'productId'> & {
  saleId: number | null
  productId: number | null
}>({
  saleId: null,
  productId: null,
  quantity: 1,
});


const ventas = computed(() =>
  saleStore.sales.map((s) => {
    const cliente = clientStore.clients.find((c) => c.id === s.clientId)?.fullName ?? `Cliente ${s.clientId}`;
    return { label: `#${s.id} - ${cliente} - ${formatFecha(s.saleDate)}`, value: s.id };
  }),
);
const productos = computed(() =>
  productStore.products.map((p) => ({
    label: `${p.name} - ${formatMoneda(p.price)} (stock: ${p.stock})`,
    value: p.id,
  })),
);


onMounted(async () => {
  await Promise.all([saleStore.fetchAll(), productStore.fetchAll(), clientStore.fetchAll()]);
  if (props.editId) {
    const detail = await saleDetailStore.fetchById(props.editId);
    if (detail) {
      form.value = {
        saleId: detail.saleId,
        productId: detail.productId,
        quantity: detail.quantity,
      };
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  const dto: SaleDetailRequestDto = {
    saleId: form.value.saleId as number,
    productId: form.value.productId as number,
    quantity: form.value.quantity,
  };
  try {
    if (props.editId) {
      await saleDetailStore.update(props.editId, dto);
    } else {
      await saleDetailStore.create(dto);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el detalle de venta');
  }
}
</script>
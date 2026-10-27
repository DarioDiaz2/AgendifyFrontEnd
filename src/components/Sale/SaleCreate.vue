<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Venta' : 'Nueva Venta' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-select
          v-model="form.clientId"
          :options="clientes"
          label="Cliente"
          outlined
          emit-value
          map-options
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number | null) => !!v || 'Selecciona el cliente']"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="saleStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useSaleStore } from 'stores/sale';
import { useClientStore } from 'stores/client';
import type { SaleRequestDto } from 'src/models/Sale/SaleRequestDto';
import { notificarError } from 'src/utils/notificar';


const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const saleStore = useSaleStore();
const clientStore = useClientStore();
const formRef = ref<QForm | null>(null);


const form = ref<Omit<SaleRequestDto, 'clientId'> & { clientId: number | null }>({
  clientId: null,
});


const clientes = computed(() =>
  clientStore.clients.map((c) => ({ label: c.fullName, value: c.id })),
);


onMounted(async () => {
  await clientStore.fetchAll();
  if (props.editId) {
    const sale = await saleStore.fetchById(props.editId);
    if (sale) {
      form.value = {
        clientId: sale.clientId,
      };
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  const dto: SaleRequestDto = {
    clientId: form.value.clientId as number,
  };
  try {
    if (props.editId) {
      await saleStore.update(props.editId, dto);
    } else {
      await saleStore.create(dto);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar la venta');
  }
}
</script>
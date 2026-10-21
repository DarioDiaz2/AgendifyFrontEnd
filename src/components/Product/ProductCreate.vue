<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Producto' : 'Nuevo Producto' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model="form.name"
          label="Nombre"
          outlined
          class="q-mb-sm"
          :maxlength="100"
          counter
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el nombre']"
        />
        <q-input
          v-model.number="form.price"
          label="Precio"
          type="number"
          step="0.01"
          outlined
          prefix="$"
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => (v !== null && v >= 0) || 'Ingresa un precio valido']"
        />
        <q-input
          v-model.number="form.stock"
          label="Stock"
          type="number"
          step="1"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[
            (v: number) => (v !== null && Number.isInteger(v) && v >= 0) || 'Ingresa un stock valido (entero)',
          ]"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="productStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useProductStore } from 'stores/product';
import type { ProductRequestDto } from 'src/models/Product/ProductRequestDto';
import { notificarError } from 'src/utils/notificar';


const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const productStore = useProductStore();
const formRef = ref<QForm | null>(null);


const form = ref<ProductRequestDto>({
  name: '',
  price: 0,
  stock: 0,
});


onMounted(async () => {
  if (props.editId) {
    const product = await productStore.fetchById(props.editId);
    if (product) {
      form.value = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  try {
    if (props.editId) {
      await productStore.update(props.editId, form.value);
    } else {
      await productStore.create(form.value);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el producto');
  }
}
</script>
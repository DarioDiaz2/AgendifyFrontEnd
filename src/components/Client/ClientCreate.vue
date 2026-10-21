<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar Cliente' : 'Nuevo Cliente' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model="form.fullName"
          label="Nombre completo"
          outlined
          class="q-mb-sm"
          :maxlength="100"
          counter
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el nombre completo']"
        />
        <q-input
          v-model="form.phone"
          label="Telefono"
          outlined
          class="q-mb-sm"
          :maxlength="20"
          counter
        />
        <q-input
          v-model="form.email"
          label="Email"
          type="email"
          outlined
          class="q-mb-sm"
          :maxlength="100"
          counter
          lazy-rules
          :rules="[
            // El email es opcional, pero si se completa tiene que ser valido
            (v: string | null) => !v || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || 'Ingresa un email valido',
          ]"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="clientStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useClientStore } from 'stores/client';
import type { ClientRequestDto } from 'src/models/Client/ClientRequestDto';
import { notificarError } from 'src/utils/notificar';


const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const clientStore = useClientStore();
const formRef = ref<QForm | null>(null);


const form = ref<ClientRequestDto>({
  fullName: '',
  phone: '',
  email: '',
});


onMounted(async () => {
  if (props.editId) {
    const client = await clientStore.fetchById(props.editId);
    if (client) {
      form.value = {
        fullName: client.fullName,
        phone: client.phone,
        email: client.email,
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
      await clientStore.update(props.editId, form.value);
    } else {
      await clientStore.create(form.value);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el cliente');
  }
}
</script>
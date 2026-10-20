import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { ClientResponseDto } from 'src/models/Client/ClientResponseDto';

export const useClientStore = defineStore('client', () => {
  const clients = ref<ClientResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Client/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<ClientResponseDto[]>('/Client/All');
      clients.value = data;
    } catch (e) {
      clients.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener los datos`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los datos';
      }
    } finally {
      loading.value = false;
    }
  }

  return { clients, loading, error, fetchAll };
});

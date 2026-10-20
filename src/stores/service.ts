import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { ServiceResponseDto } from 'src/models/Service/ServiceResponseDto';

export const useServiceStore = defineStore('service', () => {
  const services = ref<ServiceResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Service/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<ServiceResponseDto[]>('/Service/All');
      services.value = data;
    } catch (e) {
      services.value = [];
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

  return { services, loading, error, fetchAll };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { BarberResponseDto } from 'src/models/Barber/BarberResponseDto';

export const useBarberStore = defineStore('barber', () => {
  const barbers = ref<BarberResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Barber/All  */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<BarberResponseDto[]>('/Barber/All');
      barbers.value = data;
    } catch (e) {
      barbers.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener los barberos`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los barberos';
      }
    } finally {
      loading.value = false;
    }
  }

  return { barbers, loading, error, fetchAll };
});

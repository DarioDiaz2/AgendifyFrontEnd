import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { SaleResponseDto } from 'src/models/Sale/SaleResponseDto';

export const useSaleStore = defineStore('sale', () => {
  const sales = ref<SaleResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Sale/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<SaleResponseDto[]>('/Sale/All');
      sales.value = data;
    } catch (e) {
      sales.value = [];
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

  return { sales, loading, error, fetchAll };
});

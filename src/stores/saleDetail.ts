import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { SaleDetailResponseDto } from 'src/models/SaleDetail/SaleDetailResponseDto';

export const useSaleDetailStore = defineStore('saleDetail', () => {
  const saleDetails = ref<SaleDetailResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/SaleDetail/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<SaleDetailResponseDto[]>('/SaleDetail/All');
      saleDetails.value = data;
    } catch (e) {
      saleDetails.value = [];
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

  return { saleDetails, loading, error, fetchAll };
});

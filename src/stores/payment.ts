import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { PaymentResponseDto } from 'src/models/Payment/PaymentResponseDto';

export const usePaymentStore = defineStore('payment', () => {
  const payments = ref<PaymentResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Payment/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<PaymentResponseDto[]>('/Payment/All');
      payments.value = data;
    } catch (e) {
      payments.value = [];
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

  return { payments, loading, error, fetchAll };
});

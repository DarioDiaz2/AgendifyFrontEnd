import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { PaymentResponseDto } from 'src/models/Payment/PaymentResponseDto';
import type { PaymentRequestDto } from 'src/models/Payment/PaymentRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const usePaymentStore = defineStore('payment', () => {
  const payments = ref<PaymentResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

 
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
          ? `Error ${e.response.status} al obtener los pagos`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los pagos';
      }
    } finally {
      loading.value = false;
    }
  }

  
  async function fetchById(id: number): Promise<PaymentResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<PaymentResponseDto>(`/Payment/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

 
  async function create(payment: PaymentRequestDto) {
    loading.value = true;
    try {
      await api.post('/Payment', payment);
      notificarExito('Pago creado');
    } finally {
      loading.value = false;
    }
  }

  
  async function update(id: number, payment: PaymentRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Payment?Id=${id}`, payment);
      notificarExito('Pago modificado');
    } finally {
      loading.value = false;
    }
  }

  
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Payment?Id=${id}`);
      notificarExito('Pago eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { payments, loading, error, fetchAll, fetchById, create, update, borrar };
});
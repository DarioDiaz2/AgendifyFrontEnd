import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { SaleDetailResponseDto } from 'src/models/SaleDetail/SaleDetailResponseDto';
import type { SaleDetailRequestDto } from 'src/models/SaleDetail/SaleDetailRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useSaleDetailStore = defineStore('saleDetail', () => {
  const saleDetails = ref<SaleDetailResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  
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
          ? `Error ${e.response.status} al obtener los detalles de venta`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los detalles de venta';
      }
    } finally {
      loading.value = false;
    }
  }

 
  async function fetchById(id: number): Promise<SaleDetailResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<SaleDetailResponseDto>(`/SaleDetail/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  
  async function create(detail: SaleDetailRequestDto) {
    loading.value = true;
    try {
      await api.post('/SaleDetail', detail);
      notificarExito('Detalle de venta creado');
    } finally {
      loading.value = false;
    }
  }

 
  async function update(id: number, detail: SaleDetailRequestDto) {
    loading.value = true;
    try {
      await api.put(`/SaleDetail?Id=${id}`, detail);
      notificarExito('Detalle de venta modificado');
    } finally {
      loading.value = false;
    }
  }

  
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/SaleDetail?Id=${id}`);
      notificarExito('Detalle de venta eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { saleDetails, loading, error, fetchAll, fetchById, create, update, borrar };
});
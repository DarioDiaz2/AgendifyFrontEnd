import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { SaleResponseDto } from 'src/models/Sale/SaleResponseDto';
import type { SaleRequestDto } from 'src/models/Sale/SaleRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useSaleStore = defineStore('sale', () => {
  const sales = ref<SaleResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  
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
          ? `Error ${e.response.status} al obtener las ventas`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener las ventas';
      }
    } finally {
      loading.value = false;
    }
  }

  
  async function fetchById(id: number): Promise<SaleResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<SaleResponseDto>(`/Sale/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  
  async function create(sale: SaleRequestDto) {
    loading.value = true;
    try {
      await api.post('/Sale', sale);
      notificarExito('Venta creada');
    } finally {
      loading.value = false;
    }
  }

  
  async function update(id: number, sale: SaleRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Sale?Id=${id}`, sale);
      notificarExito('Venta modificada');
    } finally {
      loading.value = false;
    }
  }

 
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Sale?Id=${id}`);
      notificarExito('Venta eliminada');
    } finally {
      loading.value = false;
    }
  }

  return { sales, loading, error, fetchAll, fetchById, create, update, borrar };
});
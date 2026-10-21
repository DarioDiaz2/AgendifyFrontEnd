import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { ProductResponseDto } from 'src/models/Product/ProductResponseDto';
import type { ProductRequestDto } from 'src/models/Product/ProductRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useProductStore = defineStore('product', () => {
  const products = ref<ProductResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

 
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<ProductResponseDto[]>('/Product/All');
      products.value = data;
    } catch (e) {
      products.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener los productos`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los productos';
      }
    } finally {
      loading.value = false;
    }
  }

  
  async function fetchById(id: number): Promise<ProductResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<ProductResponseDto>(`/Product/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  
  async function create(product: ProductRequestDto) {
    loading.value = true;
    try {
      await api.post('/Product', product);
      notificarExito('Producto creado');
    } finally {
      loading.value = false;
    }
  }

  
  async function update(id: number, product: ProductRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Product?Id=${id}`, product);
      notificarExito('Producto modificado');
    } finally {
      loading.value = false;
    }
  }

  
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Product?Id=${id}`);
      notificarExito('Producto eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { products, loading, error, fetchAll, fetchById, create, update, borrar };
});
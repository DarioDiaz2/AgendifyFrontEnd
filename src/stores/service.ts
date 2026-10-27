import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { ServiceResponseDto } from 'src/models/Service/ServiceResponseDto';
import type { ServiceRequestDto } from 'src/models/Service/ServiceRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useServiceStore = defineStore('service', () => {
  const services = ref<ServiceResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  
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
          ? `Error ${e.response.status} al obtener los servicios`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los servicios';
      }
    } finally {
      loading.value = false;
    }
  }

 
  async function fetchById(id: number): Promise<ServiceResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<ServiceResponseDto>(`/Service/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  
  async function create(service: ServiceRequestDto) {
    loading.value = true;
    try {
      await api.post('/Service', service);
      notificarExito('Servicio creado');
    } finally {
      loading.value = false;
    }
  }

  
  async function update(id: number, service: ServiceRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Service?Id=${id}`, service);
      notificarExito('Servicio modificado');
    } finally {
      loading.value = false;
    }
  }

  
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Service?Id=${id}`);
      notificarExito('Servicio eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { services, loading, error, fetchAll, fetchById, create, update, borrar };
});
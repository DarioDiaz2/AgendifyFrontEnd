import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { ClientResponseDto } from 'src/models/Client/ClientResponseDto';
import type { ClientRequestDto } from 'src/models/Client/ClientRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useClientStore = defineStore('client', () => {
  const clients = ref<ClientResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<ClientResponseDto[]>('/Client/All');
      clients.value = data;
    } catch (e) {
      clients.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener los clientes`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los clientes';
      }
    } finally {
      loading.value = false;
    }
  }

  
  async function fetchById(id: number): Promise<ClientResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<ClientResponseDto>(`/Client/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }


  async function create(client: ClientRequestDto) {
    loading.value = true;
    try {
      await api.post('/Client', client);
      notificarExito('Cliente creado');
    } finally {
      loading.value = false;
    }
  }

  
  async function update(id: number, client: ClientRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Client?Id=${id}`, client);
      notificarExito('Cliente modificado');
    } finally {
      loading.value = false;
    }
  }

 
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Client?Id=${id}`);
      notificarExito('Cliente eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { clients, loading, error, fetchAll, fetchById, create, update, borrar };
});
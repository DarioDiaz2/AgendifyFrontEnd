import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { BarberResponseDto } from 'src/models/Barber/BarberResponseDto';
import type { BarberRequestDto } from 'src/models/Barber/BarberRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useBarberStore = defineStore('barber', () => {
  const barbers = ref<BarberResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Barber/All */
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

  /** GET api/Barber/ById?Id=... Devuelve el barbero o null si no existe. */
  async function fetchById(id: number): Promise<BarberResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<BarberResponseDto>(`/Barber/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Barber */
  async function create(barber: BarberRequestDto) {
    loading.value = true;
    try {
      await api.post('/Barber', barber);
      notificarExito('Barbero creado');
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Barber?Id=... */
  async function update(id: number, barber: BarberRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Barber?Id=${id}`, barber);
      notificarExito('Barbero modificado');
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Barber?Id=... (se llama borrar porque delete es palabra reservada) */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Barber?Id=${id}`);
      notificarExito('Barbero eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { barbers, loading, error, fetchAll, fetchById, create, update, borrar };
});
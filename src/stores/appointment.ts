import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { AppointmentResponseDto } from 'src/models/Appointment/AppointmentResponseDto';
import type { AppointmentRequestDto } from 'src/models/Appointment/AppointmentRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useAppointmentStore = defineStore('appointment', () => {
  const appointments = ref<AppointmentResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

 
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<AppointmentResponseDto[]>('/Appointment/All');
      appointments.value = data;
    } catch (e) {
      appointments.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener las citas`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener las citas';
      }
    } finally {
      loading.value = false;
    }
  }


  async function fetchById(id: number): Promise<AppointmentResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<AppointmentResponseDto>(`/Appointment/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  
  async function create(appointment: AppointmentRequestDto) {
    loading.value = true;
    try {
      await api.post('/Appointment', appointment);
      notificarExito('Cita creada');
    } finally {
      loading.value = false;
    }
  }

 
  async function update(id: number, appointment: AppointmentRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Appointment?Id=${id}`, appointment);
      notificarExito('Cita modificada');
    } finally {
      loading.value = false;
    }
  }

 
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Appointment?Id=${id}`);
      notificarExito('Cita eliminada');
    } finally {
      loading.value = false;
    }
  }

  return { appointments, loading, error, fetchAll, fetchById, create, update, borrar };
});
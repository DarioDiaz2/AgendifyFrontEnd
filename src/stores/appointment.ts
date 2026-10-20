import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { AppointmentResponseDto } from 'src/models/Appointment/AppointmentResponseDto';

export const useAppointmentStore = defineStore('appointment', () => {
  const appointments = ref<AppointmentResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Appointment/All */
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
          ? `Error ${e.response.status} al obtener los datos`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los datos';
      }
    } finally {
      loading.value = false;
    }
  }

  return { appointments, loading, error, fetchAll };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { ReviewResponseDto } from 'src/models/Review/ReviewResponseDto';
import type { ReviewRequestDto } from 'src/models/Review/ReviewRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useReviewStore = defineStore('review', () => {
  const reviews = ref<ReviewResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<ReviewResponseDto[]>('/Review/All');
      reviews.value = data;
    } catch (e) {
      reviews.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener las resenas`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener las resenas';
      }
    } finally {
      loading.value = false;
    }
  }

  
  async function fetchById(id: number): Promise<ReviewResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<ReviewResponseDto>(`/Review/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

 
  async function create(review: ReviewRequestDto) {
    loading.value = true;
    try {
      await api.post('/Review', review);
      notificarExito('Resena creada');
    } finally {
      loading.value = false;
    }
  }

 
  async function update(id: number, review: ReviewRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Review?Id=${id}`, review);
      notificarExito('Resena modificada');
    } finally {
      loading.value = false;
    }
  }

  
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Review?Id=${id}`);
      notificarExito('Resena eliminada');
    } finally {
      loading.value = false;
    }
  }

  return { reviews, loading, error, fetchAll, fetchById, create, update, borrar };
});
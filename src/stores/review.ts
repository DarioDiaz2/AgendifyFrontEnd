import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { ReviewResponseDto } from 'src/models/Review/ReviewResponseDto';

export const useReviewStore = defineStore('review', () => {
  const reviews = ref<ReviewResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Review/All */
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
          ? `Error ${e.response.status} al obtener los datos`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los datos';
      }
    } finally {
      loading.value = false;
    }
  }

  return { reviews, loading, error, fetchAll };
});

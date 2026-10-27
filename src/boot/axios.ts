import { defineBoot } from '#q-app/wrappers';
import axios, { isAxiosError, type AxiosInstance } from 'axios';
import { useAuthStore } from 'stores/auth';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}


const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export default defineBoot(({ app, router }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  
  api.interceptors.request.use((config) => {
    const auth = useAuthStore();
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  });

  
  api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        useAuthStore().logout();
        void router.push('/');
      }
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    },
  );
});

export { api };
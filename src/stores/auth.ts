import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { LoginUserRequestDto } from 'src/models/Auth/LoginUserRequestDto';
import type { LoginUserResponseDto } from 'src/models/Auth/LoginUserResponseDto';


const TOKEN_KEY = 'token';
const USER_KEY = 'userName';

export const useAuthStore = defineStore('auth', () => {
  
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const userName = ref<string | null>(localStorage.getItem(USER_KEY));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => token.value !== null);

  
  async function login(credenciales: LoginUserRequestDto): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.post<LoginUserResponseDto>('/Auth/login', credenciales);
      token.value = data.token;
      userName.value = data.userName;
      localStorage.setItem(TOKEN_KEY, data.token ?? '');
      localStorage.setItem(USER_KEY, data.userName ?? '');
      return true;
    } catch (e) {
      
      if (isAxiosError<LoginUserResponseDto>(e) && e.response?.data?.errores?.length) {
        error.value = e.response.data.errores.join(' ');
      } else {
        error.value = 'No se pudo iniciar sesion';
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  
  function logout() {
    token.value = null;
    userName.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return { token, userName, loading, error, isAuthenticated, login, logout };
});

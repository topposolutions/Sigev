import AuthService from './auth/auth.service';
import JwtService from './jwt.service';
const { useAuthStore } = import('../../stores/auth.store');

let isRefreshing = false;
let failedQueue = [];
let isRedirecting = false;

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export function setupAxiosInterceptors(api) {
  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const { data } = await AuthService.refreshToken();
        const newToken = data?.access_token || data?.token;
        if (newToken) {
          JwtService.saveToken(newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          throw new Error('No token in refresh response');
        }
      } catch (err) {
        processQueue(err, null);

        // Limpa o token e atualiza o store de autenticação
        JwtService.destroyToken();

        // Atualiza o store de autenticação se disponível
        try {
          const authStore = useAuthStore();
          authStore.purgeAuth();
        } catch (storeError) {
          console.error('Erro ao atualizar store de autenticação:', storeError);
        }

        if (!isRedirecting) {
          isRedirecting = true;
          window.location.href = '/login';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  );
} 
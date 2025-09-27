import { useHtmlClassStore } from '../stores/htmlclass.simple.store.js';
import { useAuthStore } from '../stores/auth.store.js';
import Swal from 'sweetalert2';

export function useLogout(router = null) {
  const htmlClassStore = useHtmlClassStore();
  
  const logout = () => {
    htmlClassStore.startLoading();
    
    setTimeout(() => {
      try {
        const authStore = useAuthStore();
        authStore.logout();
        
        // Usar router passado como parâmetro ou fallback
        if (router) {
          router.push("/login");
        } else if (window.router) {
          window.router.push("/login");
        } else {
          // Fallback para reload da página
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Erro no logout:", error);
        Swal.fire({
          title: "Erro",
          text: "Erro ao Realizar Logout",
          icon: "error",
        });
      } finally {
        htmlClassStore.stopLoading();
      }
    }, 500);
  };

  return {
    logout
  };
} 
import { useAuthStore } from '../../stores/auth.store'

export default async function redirectIfAuthenticated({ next, router }) {
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
        const authStore = useAuthStore();
        
        // Verifica se está autenticado (incluindo validação de token)
        const isAuthenticated = await authStore.verifyAuth();

        if (isAuthenticated) {
            return router.push({ name: "Chat" });
        }

        return next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return next();
    }
}
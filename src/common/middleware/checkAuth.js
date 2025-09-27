import { useAuthStore } from '../../stores/auth.store'

export default async function checkAuth({ next, router, to }) {
    const authStore = useAuthStore();

    // Verifica a autenticação (incluindo validação de token)
    const isAuthenticated = await authStore.verifyAuth();
    console.log("checkAuth - isAuthenticated:", isAuthenticated);

    if (!isAuthenticated) {
        router.push({ name: "login" });
        return;
    }

    let path = to.path.replace("/", "");

    if (path == "home") return next();

    return next();
}
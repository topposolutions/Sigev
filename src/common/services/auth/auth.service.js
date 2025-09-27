import ApiAuthService from '../api-auth.service.js'

const AuthService = {
    login(credentials) {
        return ApiAuthService.post(`/token`, {
            ...credentials
        });
    },

    recoveryPassword(login, email, senha) {
        return ApiAuthService.post(`recuperar-senha//`, {
            login: login,
            email: email,
            senha: senha,
        });
    },

    async validateToken(token) {
        token = token.replace("Bearer ", "");
        let { data } = await ApiAuthService.get(
            `/auth/token-valido?token=${token}`
        );
        return data;
    },

    confirmPassword(token) {
        return ApiAuthService.post(`recuperar-senha/validacao?token=${token}/`);
    },
    refreshToken() {
        return ApiAuthService.post(`/token/refresh/`);
    },

    cancelPassword(token) {
        return ApiAuthService.post(`recuperar-senha/cancelar?token=${token}/`);
    },
};

export default AuthService;

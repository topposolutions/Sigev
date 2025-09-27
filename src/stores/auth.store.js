import { defineStore } from 'pinia';
import JwtService from '../common/services/jwt.service.js';
import AuthService from '../common/services/auth/auth.service.js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        errors: null,
        user: {},
        isAuthenticated: false, // Inicializa como false, será verificado via verifyAuth
    }),

    getters: {
        currentUser: (state) => state.user,
        //isAuthenticated: (state) => state.isAuthenticated,
        isAdmin: () => JwtService.getPerfis()?.some(el => el.codPerfil === "IS_ADMIN"),
    },

    actions: {
        async login(credentials) {
            const payload = {
                username: credentials.username,
                password: credentials.password,
                grant_type: credentials.grant_type,
                client_id: credentials.client_id,
                client_secret: credentials.client_secret,
            }
            const result = await AuthService.login(payload);

            if (result.status === 200) {
                result.data.jwtToken = result.data.access_token;
                this.setAuth(result.data);
                return true;
            }

            throw new Error("Login failed");
        },

        logout() {
            this.purgeAuth();
        },

        setAuth(user) {
            this.isAuthenticated = true;
            //this.user = user;
            this.errors = null;

            //if (user.id) JwtService.saveId(user.id);
            //if (user.email) JwtService.saveEmail(user.email);
            if (user.jwtToken) {
                JwtService.saveToken(user.jwtToken);
            }
        },

        purgeAuth() {
            this.isAuthenticated = false;
            this.user = {};
            this.errors = null;
            JwtService.destroyEmail();
            JwtService.destroyToken();
            JwtService.destroyNome();
        },

        // Nova ação para verificar autenticação (apenas validação no cliente)
        async verifyAuth() {
            const token = JwtService.getToken();
            
            if (!token) {
                this.isAuthenticated = false;
                return false;
            }

            try {
                // Primeiro verifica se o token tem estrutura válida
                if (!JwtService.isTokenValid(token)) {
                    this.purgeAuth();
                    return false;
                }

                // Depois verifica se o token não expirou
                if (JwtService.isTokenExpired(token)) {
                    this.purgeAuth();
                    return false;
                }
                // Se chegou até aqui, o token é válido
                this.isAuthenticated = true;
                
                return true;
            } catch (error) {
                this.purgeAuth();
                return false;
            }
        },
 
    },
});
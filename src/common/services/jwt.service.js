

const ID_TOKEN_KEY = "id_token";
const getToken = () => window.localStorage.getItem(ID_TOKEN_KEY);
const saveToken = (token) => window.localStorage.setItem(ID_TOKEN_KEY, token);
const destroyToken = () => window.localStorage.removeItem(ID_TOKEN_KEY);

const ID_EMAIL_KEY = "id_email";
const getEmail = () => window.localStorage.getItem(ID_EMAIL_KEY);
const saveEmail = (email) => window.localStorage.setItem(ID_EMAIL_KEY, email);
const destroyEmail = () => window.localStorage.removeItem(ID_EMAIL_KEY);

const ID_NOME_KEY = "id_nome";
const getNome = () => window.localStorage.getItem(ID_NOME_KEY);
const saveNome = (nome) => window.localStorage.setItem(ID_NOME_KEY, nome);
const destroyNome = () => window.localStorage.removeItem(ID_NOME_KEY);

// Função para decodificar JWT token
const decodeToken = (token) => {
    try {
        if (!token || typeof token !== 'string') {
            return null;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

// Função para verificar se o token expirou
const isTokenExpired = (token) => {
    try {
        const payload = decodeToken(token);
        if (!payload || !payload.exp) {
            return true;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < (currentTime - 300);
        return isExpired;
    } catch (error) {
        return true;
    }
};


// Função para verificar se o token é válido (estrutura e formato)
const isTokenValid = (token) => {
    try {
        if (!token || typeof token !== 'string') {
            return false;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            return false;
        }

        const payload = decodeToken(token);
        if (!payload) {
            return false;
        }

        // Verifica se tem campo obrigatório (exp)
        if (!payload.exp) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};

export default {
    getToken,
    saveToken,
    destroyToken,
    getEmail,
    saveEmail,
    destroyEmail,
    getNome,
    saveNome,
    destroyNome,
    decodeToken,
    isTokenExpired,
    isTokenValid,
};

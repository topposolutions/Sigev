import axios from "axios";
import JwtService from "./jwt.service";
import { ENDPOINT_LOGIN } from "./config";
import qs from "qs";
import { setupAxiosInterceptors } from './axios-interceptor';

const api = axios.create({
    baseURL: ENDPOINT_LOGIN,
    headers: {
        "Content-Language": "pt-BR",
        "Content-Type": "application/x-www-form-urlencoded"
    },
    withCredentials: false,
});

setupAxiosInterceptors(api);

const ApiAuthService = {
    setHeader() {
        api.defaults.headers.common["Authorization"] = JwtService.getToken();
        delete axios.defaults.headers.common["user"];
        delete axios.defaults.headers.common["chave"];
        api.defaults.headers.common["Content-Language"] = "pt-BR";
    },

    get(resource, slug = "") {
        this.setHeader();
        return api.get(`${resource}/${slug}`);
    },

    post(resource, params, config = null) {
        const data = qs.stringify(params);
        this.setHeader();
        return api.post(`${resource}`, data, config);
    },
};

export default ApiAuthService;

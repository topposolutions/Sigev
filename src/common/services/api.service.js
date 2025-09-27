import axios from "axios";
import JwtService from "./jwt.service";
import { ENDPOINT_URL } from "./config";
import { setupAxiosInterceptors } from './axios-interceptor';

const api = axios.create({
    baseURL: ENDPOINT_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Language': 'pt-BR',
        'Content-Type': 'application/json',
    },
});

setupAxiosInterceptors(api);

const ApiService = {

    /**
   * Set the default HTTP request headers
   */
    setHeader() {
        api.defaults.headers.common["Authorization"] = `Bearer ${JwtService.getToken()}`
        delete axios.defaults.headers.common["user"];
        delete axios.defaults.headers.common["chave"];
        api.defaults.headers.common["Content-Language"] = "pt-BR";
    },

    /**
     * Send the GET HTTP request
     * @param resource
     * @param slug
     * @returns {*}
    */

    get(resource, slug = "") {
        this.setHeader();
        return api.get(`${resource}/${slug}`);
    },

    /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
    post(resource, params, config = null) {
        this.setHeader();
        return api.post(`${resource}`, params, config);
    },


    /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
    delete(resource) {
        this.setHeader();
        return api.delete(resource).catch((error) => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },
};

export default ApiService;

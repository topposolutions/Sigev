import Vue from "vue";
// import { ENDPOINT_API_GATEWAY2 } from "@/common/config";
import JwtService from "./jwt.service.js";
/**
 * Service to call HTTP request via Axios
 */
let ENDPOINT_API_GATEWAY2 = 'localhost://w312321'
const ApiGatewayService = {
    slug: "",
    init() { },

    /**
     * Set the default HTTP request headers
     */
    setHeader(config = null) {
        Vue.axios.defaults.headers.common["Authorization"] = JwtService.getToken();
        this.setbaseURL();
        Vue.axios.defaults.headers.common["Content-Language"] = "pt-BR";
        if (config) this.updateHeaders(config.header);
    },

    updateHeaders(headers) {
        for (let attr in headers) {
            Vue.axios.defaults.headers.common[attr] = headers[attr];
        }
    },

    setbaseURL() {
        Vue.axios.defaults.baseURL = ENDPOINT_API_GATEWAY2; //"http://localhost:2194/api/";
    },

    /**
     * Send the GET HTTP request
     * @param resource
     * @param params
     * @returns {*}
     */
    get(resource, params) {
        this.setHeader();
        return Vue.axios.get(`${resource}/`, { params });
    },

    /**
     * Send the GET HTTP request
     * @param resource
     * @param params
     * @param config
     * @returns {*}
     */
    query(resource, params) {
        this.setHeader();
        return Vue.axios.get(resource, params).catch((error) => {
            throw new Error(`[Porto] ApiService ${error}`);
        });
    },

    /**
     * Send the GET HTTP request
     * @param resource
     * @param params
     * @param config
     * @returns {*}
     */
    queryWithParams(resource, params, config) {
        this.setHeader();
        return Vue.axios.get(resource, { params }, config).catch((error) => {
            throw new Error(`[Porto] ApiService ${error}`);
        });
    },

    /**
     * Set the POST HTTP request
     * @param resource
     * @param params
     * @param config
     * @returns {*}
     */
    post(resource, params, config = null) {
        this.setHeader(config);
        return Vue.axios.post(`${resource}`, params, config);
    },

    /**
     * Send the UPDATE HTTP request
     * @param resource
     * @param slug
     * @param params
     * @returns {IDBRequest<IDBValidKey> | Promise<void>}
     */
    update(resource, slug, params) {
        this.setHeader();
        return Vue.axios.put(`${resource}/${slug}`, params);
    },

    /**
     * Send the PUT HTTP request
     * @param resource
     * @param params
     * @returns {IDBRequest<IDBValidKey> | Promise<void>}
     */
    put(resource, params) {
        this.setHeader();
        return Vue.axios.put(`${resource}`, params);
    },

    patch(resource, params) {
        this.setHeader();
        return Vue.axios.patch(`${resource}`, params);
    },

    /**
     * Send the DELETE HTTP request
     * @param resource
     * @returns {*}
     */
    delete(resource, params) {
        this.setHeader();
        return Vue.axios.delete(`${resource}`, params);
    },

    uploadFile(resource, file) {
        let data = new FormData();
        data.append("fileName", file.name);
        data.append("file", file);
        let config = {
            header: {
                "Content-Type": "multipart/form-data",
            },
        };

        return this.post(resource, data, config);
    },

    uploadFileLCL(resource, params, tiposArquivos) {
        let config = {
            header: {
                "Content-Type": "multipart/form-data",
                "tipos-arquivo": tiposArquivos,
            },
        };
        this.setHeader(config);
        return Vue.axios.post(`${resource}`, params, config);
    },
};

export default ApiGatewayService;

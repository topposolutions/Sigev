const {
    VITE_APP_ENVIRONMENT,
    VITE_APP_URL,
    VITE_APP_URL_WEB_SOCKET_CONNECTION,
} =  import.meta.env;

export const isProd = VITE_APP_ENVIRONMENT == "prod";
export const isDev = VITE_APP_ENVIRONMENT  == "dev";
export const ENDPOINT_WEB_SOCKET_CONNECTION = VITE_APP_URL_WEB_SOCKET_CONNECTION;
export const ENDPOINT_URL = VITE_APP_URL
export const ENDPOINT_LOGIN = `${VITE_APP_URL}`;  

export default {
    ENDPOINT_LOGIN,
    LOADING_COLOR: "#7dba19", // Define color for all v-overlay spinners loading
    FORMAT_REPORT_DATE: "DD/MM/YYYY HH:mm", // Define the format for dates
    FORMAT_REPORT_DATE_SEC: "DD/MM/YYYY HH:mm:ss", // Define the format for dates
    FORMAT_REPORT_DATE_WITHOUT_HOUR: "DD/MM/YYYY", // Define the format for dates
    FORMAT_REPORT_DATE_EN: "YYYY-MM-DD", // Define the format for dates in 'en' format
    FORMAT_REPORT_DATE_EN_HOURS: "YYYY-MM-DD HH:mm", // Define the format for dates in 'en' format with hours
    FORMAT_REPORT_HOURS: "HH:mm", // Define the format for dates in 'en' format with hours
    VITE_APP_ENVIRONMENT,
    ENDPOINT_URL
};

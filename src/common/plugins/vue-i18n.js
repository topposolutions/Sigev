import { createI18n } from 'vue-i18n'
import { locale as en } from "../config/i18n/en";
import { locale as pt } from "../../common/config/i18n/pt-br";

const messages = {
    'en': en,
    'pt-br': pt
};
const lang = localStorage.getItem("userLanguage") || "pt-br";

export default createI18n({
    legacy: false,
    globalInjection: true,
    locale: lang,
    fallbackLocale: 'pt-br',
    messages
}) 
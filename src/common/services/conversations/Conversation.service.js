import ApiService from "../api.service";
//import helpers from "@/common/helpers";
import jwtService from "../jwt.service";
import moment from "moment";


const ConversationService = {
    slug: "conversa",
    async list() {
        return await ApiService.get(`/${this.slug}`);
    },

    async getMessagesById(id) {
        return await ApiService.get(`${this.slug}`,id);
    },

    async sent(form) {
        return await ApiService.post(`/${this.slug}/mensagem`, form);
    },
    async delete(conversationId) {
        return await ApiService.delete(`/${this.slug}/${conversationId}`);
    },
    async selecioneConversaPeloDocumento(form) {
        return await ApiService.post(`/${this.slug}/acao-documento`, form);
    },
};

export default ConversationService;

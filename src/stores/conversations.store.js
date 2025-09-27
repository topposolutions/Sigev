import { defineStore } from 'pinia';

export const useConversationStore = defineStore('conversation', {
    state: () => ({
        errors: null,
        conversation_id: null,
    }),

    getters: {
        conversationId: (state) => state.conversation_id,
    },

    actions: {
        setConversationId(id) {
            this.conversation_id = id;
        },
        clearConversationId() {
            this.conversation_id = null;
        },
        setError(error) {
            this.errors = error;
        },
        clearError() {
            this.errors = null;
        },
    },
});
<template>
  <div class="chat-page">
    <div class="chat-interface">
      <ChatHeader
        :messages-length="messages.length"
        @clear-chat="clearChat"
        @toggle-sidebar="toggleSidebar"
        @toggle-conversations-drawer="toggleConversationsDrawer"
        @new-conversation-tab="newConversationTab"
      />

      <div class="chat-container">
        <div class="chat-messages" ref="messagesContainer">
          <ChatWelcome v-if="messages.length === 0" />
          <ChatMessages
            v-else
            :messages="messages"
            :is-typing="isTyping"
            @send-suggested-question="sendSuggestedQuestion"
          />
        </div>

        <ChatInput
          :pending-files="pendingFiles"
          :is-processing="isProcessing"
          :can-send-message="canSendMessage"
          v-model:currentMessage="currentMessage"
          :quick-actions="quickActions"
          :attached-documents="attachedDocuments"
          @clear-pending-files="clearPendingFiles"
          @remove-pending-file="removePendingFile"
          @send-message="handleSendMessage"
          @send-quick-action="sendQuickAction"
          @files-selected="onFilesSelected"
        />
      </div>

      <DocumentSidebar
        :attached-documents="attachedDocuments"
        :show="showSidebar"
        @toggle-sidebar="toggleSidebar"
        @trigger-file-input="triggerFileInput"
        @remove-document="removeDocument"
      />

      <ConversationsDrawer
        :conversations="conversations"
        :active-conversation-id="activeConversationId"
        :hovered-conversation-id="hoveredConversationId"
        :menu-open-id="menuOpenId"
        :show="showConversationsDrawer"
        @toggle-conversations-drawer="toggleConversationsDrawer"
        @hover-conversation="hoverConversation"
        @open-menu="openMenu"
        @delete-conversation="deleteConversation"
        @list-messages="listMessages"
        @close-conversations-drawer="showConversationsDrawer = false"
      />
    </div>
  </div>
</template>

<script>
import {
  FileText,
  Search,
  HelpCircle,
  BarChart3,
  File,
  FileSpreadsheet,
} from "lucide-vue-next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ChatHeader from "./components/ChatHeader.vue";
import ChatWelcome from "./components/ChatWelcome.vue";
import ChatMessages from "./components/ChatMessages.vue";
import ChatInput from "./components/ChatInput.vue";
import DocumentSidebar from "./components/DocumentSidebar.vue";
import ConversationsDrawer from "./components/ConversationsDrawer.vue";
import ConversationService from "../../common/services/conversations/Conversation.service";
import Swal from "sweetalert2";

export default {
  name: "ChatInterface",
  components: {
    ChatHeader,
    ChatWelcome,
    ChatMessages,
    ChatInput,
    DocumentSidebar,
    ConversationsDrawer,
    FileText,
    Search,
    HelpCircle,
    BarChart3,
    File,
    FileSpreadsheet,
  },

  data() {
    return {
      conversationId: null,
      messages: [],
      currentMessage: "",
      pendingFiles: [],
      attachedDocuments: [],
      isTyping: false,
      isProcessing: false,
      showSidebar: false,
      showConversationsDrawer: false,
      fileInput: null,
      messagesContainer: null,
      hoveredConversationId: null,
      menuOpenId: null,
      menuPosition: { top: 0, left: 0 },
      quickActions: [
        { text: "Resumir documentos", icon: FileText },
        { text: "Principais pontos", icon: Search },
        { text: "Fazer pergunta", icon: HelpCircle },
        { text: "Analisar dados", icon: BarChart3 },
      ],
      conversations: [],
      activeConversationId: null,
      skipNextListMessages: false,
    };
  },
  computed: {
    canSendMessage() {
      return (
        (this.currentMessage.trim() || this.pendingFiles.length > 0) &&
        !this.isProcessing
      );
    },
    routeConversationId() {
      return this.$route.params.id;
    },
  },
  mounted() {
    if (this.routeConversationId) {
      this.listMessages(this.routeConversationId);
      this.activeConversationId = this.routeConversationId;
    }
    this.scrollToBottom();
    if (typeof window !== "undefined") {
      window.addEventListener("click", this.handleClickOutside);
    }
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("click", this.handleClickOutside);
    }
  },
  watch: {
    routeConversationId(newId, oldId) {
      if (this.skipNextListMessages) {
        this.skipNextListMessages = false;
        this.activeConversationId = newId;
        return;
      }
      if (newId && newId !== oldId) {
        this.listMessages(newId);
        this.activeConversationId = newId;
      }
      if (!newId) {
        this.messages = [];
        this.conversationId = null;
        this.activeConversationId = null;
      }
    },
  },
  methods: {
    redirectToChat() {
      this.$router.push({ name: "Chat" });
    },
    newConversationTab() {
      this.conversationId = null;
      this.messages = [];
      this.currentMessage = "";
      this.pendingFiles = [];
      this.redirectToChat();
    },
    listMessages(id) {
      this.conversationId = id;
      ConversationService.getMessagesById(id)
        .then((result) => {
          this.messages = result.data.mensagens;
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        })
        .catch(() => {
          Swal.fire({
            title: this.$t("COMMONS.ERROR_TITLE"),
            text: this.$t("COMMONS.ERROR_MESSAGE"),
            icon: "error",
          });
        });
    },
    list() {
      ConversationService.list()
        .then((result) => {
          this.conversations = result.data;
        })
        .catch(() => {
          Swal.fire({
            title: this.$t("COMMONS.ERROR_TITLE"),
            text: this.$t("COMMONS.ERROR_MESSAGE"),
            icon: "error",
          });
        });
    },
    triggerFileInput() {
      this.$refs.fileInput?.click();
    },
    
    removePendingFile(index) {
      this.pendingFiles.splice(index, 1);
    },
    clearPendingFiles() {
      this.pendingFiles = [];
    },
    removeDocument(docId) {
      const index = this.attachedDocuments.findIndex((doc) => doc.id === docId);
      if (index !== -1) {
        this.attachedDocuments.splice(index, 1);
      }
    },
    async handleSendMessage(message) {
      if (!this.canSendMessage) return;
      this.isTyping = true;
      this.isProcessing = true;

      const userMessage = {
        content: message,
        role: "human",
        timestamp: new Date(),
      };

      this.messages = [...this.messages, userMessage];
      this.scrollToBottom();

      this.currentMessage = "";

      try {
        const payload = {
          provedor_llm_id: 0,
          modelo_llm_id: 0,
          conversa_id: this.conversationId ? this.conversationId : "",
          mensagem: {
            content: message,
          },
        };

        const response = await ConversationService.sent(payload);
        this.isTyping = false;
        await this.processApiResponse(response.data);
      } catch (error) {
        Swal.fire({
          title: this.$t("COMMONS.ERROR_TITLE"),
          text: this.$t("COMMONS.ERROR_MESSAGE"),
          icon: "error",
        });
      } finally {
        this.isTyping = false;
        this.isProcessing = false;
      }
    },

    async processApiResponse(apiResponse) {
      if (!apiResponse?.respostas?.length) {
        console.warn("Empty response from API");
        return;
      }

      if (apiResponse.conversa_id && !this.conversationId) {
        this.conversationId = apiResponse.conversa_id;
        this.skipNextListMessages = true;
        this.$router.push({
          name: "ChatWithId",
          params: { id: apiResponse.conversa_id },
        });
      }

      let respostaComposta = "";
      let arquivosRelevantesUnificados = [];

      apiResponse.respostas.forEach((item, idx) => {
        respostaComposta += `<b></b> ${item.resposta}`;

        if (
          item.documentos_relevantes &&
          item.documentos_relevantes.length > 0
        ) {
          arquivosRelevantesUnificados.push(...item.documentos_relevantes);
        }

        if (idx < apiResponse.respostas.length - 1) {
          respostaComposta +=
            '<hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 16px 0;">';
        }
      });

      await this.streamAssistantResponse(
        respostaComposta,
        arquivosRelevantesUnificados
      );
    },

    async streamAssistantResponse(fullText, relevantFiles = []) {
      const assistantMessage = {
        id: Date.now().toString(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
        documentos: relevantFiles,
        isStreaming: true,
      };

      this.messages = [...this.messages, assistantMessage];
      this.scrollToBottom();

      // Dividir texto em partes para streaming
      const words = fullText.split(" ");
      const wordsPerChunk = 3; // Mostrar 3 palavras por vez

      for (let i = 0; i < words.length; i += wordsPerChunk) {
        const chunk = words.slice(i, i + wordsPerChunk).join(" ");

        // Atualizar a última mensagem (do assistente)
        const lastMessageIndex = this.messages.length - 1;
        this.messages[lastMessageIndex].content +=
          (this.messages[lastMessageIndex].content ? " " : "") + chunk;

        this.messages = [...this.messages];

        this.scrollToBottom();
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Marcar streaming como concluído
      const lastMessageIndex = this.messages.length - 1;
      this.messages[lastMessageIndex].isStreaming = false;
      this.messages = [...this.messages];

      // Atualizar documentos relevantes
      if (relevantFiles?.length) {
        this.attachedDocuments = [
          ...this.attachedDocuments,
          ...relevantFiles.map((file) => ({
            id: file.arquivo_id?.toString() || Date.now().toString(),
            name: file.nome,
            type: file.arquivo_tipo || "application/octet-stream",
            status: "processed",
          })),
        ];
      }
    },

    
    async generateAssistantResponse(userMessage, attachments) {
      this.isTyping = true;
      return;
    },
    sendSuggestedQuestion(suggestion) {
      this.currentMessage = suggestion;
      this.sendMessage();
    },
    sendQuickAction(action) {
      this.currentMessage = action;
      this.sendMessage();
    },
    clearChat(id) {
      if (confirm("Tem certeza que deseja limpar todo o histórico do chat?")) {
        this.messages = [];
        this.attachedDocuments = [];
        this.clearPendingFiles();

        this.deleteConversation(id);
        this.redirectToChat();
      }
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    toggleConversationsDrawer() {
      if (!this.showConversationsDrawer) this.list();
      this.showConversationsDrawer = !this.showConversationsDrawer;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.messagesContainer) {
          this.$refs.messagesContainer.scrollTop =
            this.$refs.messagesContainer.scrollHeight;
        }
      });
    },
    formatTime(date) {
      return format(date, "HH:mm", { locale: ptBR });
    },
    formatMessageContent(content) {
      return content.replace(/\n/g, "<br>");
    },
   
    openMenu(id, event) {
      this.activeConversationId = id;
      this.menuOpenId = id;
      this.$nextTick(() => {
        const btn = event.target;
        const rect = btn.getBoundingClientRect();
        this.menuPosition.top = btn.offsetTop + btn.offsetHeight + 8;
        this.menuPosition.left = btn.offsetLeft - 80;
      });
    },
    deleteConversationHandler(id) {
      ConversationService.delete(id)
        .then((result) => {})
        .catch(() => {
          Swal.fire({
            title: this.$t("COMMONS.ERROR_TITLE"),
            text: this.$t("COMMONS.ERROR_MESSAGE"),
            icon: "error",
          });
        });
    },
    deleteConversation(id) {
      this.conversations = this.conversations.filter((c) => c.id !== id);
      this.menuOpenId = null;

      // Se a conversa deletada for a ativa OU a da URL, resetar o chat e redirecionar
      if (this.activeConversationId === id || this.routeConversationId === id) {
        this.messages = [];
        this.attachedDocuments = [];
        this.activeConversationId = null;
        this.conversationId = null;
        this.redirectToChat();
      }

      this.deleteConversationHandler(id);
    },
    hoverConversation(id) {
      this.hoveredConversationId = id;
    },
    handleClickOutside(event) {
      if (
        !event.target.closest(".conversation-menu") &&
        !event.target.closest(".btn-menu")
      ) {
        this.menuOpenId = null;
      }
    },
    onFilesSelected(files) {
      this.pendingFiles.push(...files);
    },
  },
};
</script>

<style>
.chat-interface {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}

.chat-messages {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  padding: var(--spacing-md);
  background-color: var(--bg-light);
  padding-bottom: 250px;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 32px;
  margin: 0 auto;
  max-width: 800px;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .message-content {
    max-width: 85%;
  }

  .document-sidebar {
    width: 100%;
    right: -100%;
  }

  .quick-actions {
    justify-content: center;
  }

  .suggestions-list {
    justify-content: center;
  }
}

@media (max-width: 700px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}

.form-control {
  padding: 20px;
}
.chat-page {
  height: calc(100vh - 70px);
  overflow: hidden;
}
</style>

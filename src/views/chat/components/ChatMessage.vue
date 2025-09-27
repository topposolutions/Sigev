<template>
  <div
    class="message"
    :class="{
      'user-message': message.role === 'human',
      'assistant-message': message.role === 'assistant',
    }"
  >
    <div class="message-avatar">
      <div v-if="message.role === 'human'" class="avatar user-avatar">
        <User :size="16" />
      </div>
      <div v-else class="avatar assistant-avatar">
        <Bot :size="16" />
      </div>
    </div>
    <div class="message-content">
      <div class="message-header">
        <span class="message-sender">
          {{ message.role === "human" ? "Você" : "Assistente" }}
        </span>
        <span class="message-time">
          {{ formatTime(message.timestamp) }}
        </span>
      </div>
      <div class="message-body">
        <div
          v-if="message.content || message.resposta"
          class="message-text"
          v-html="formatMessageContent(message.content || message.resposta)"
        ></div>
        <!-- Documentos considerados -->
        <div
          v-if="
            message.documentos &&
            message.documentos.length > 0 &&
            !message.isStreaming
          "
          class="message-documents"
        >
          <small class="text-muted">
            Documentos considerados:
            <span class="document-names">
              {{ message.documentos.map((doc) => doc.nome).join(", ") }}
            </span>
          </small>
        </div>
        <div
          v-if="message?.attachments && message.attachments.length > 0"
          class="message-attachments"
        >
          <div class="attachments-header">
            <Paperclip :size="14" class="me-1" />
            Anexos ({{ message?.attachments.length }})
          </div>
          <div class="attachments-list">
            <div
              v-for="file in message.attachments"
              :key="file.id"
              class="attachment-item"
            >
              <div class="d-flex align-items-center">
                <div class="file-icon me-2">
                  <component
                    :is="getFileIcon(file.type)"
                    :size="16"
                    :class="getFileTypeColor(file.type)"
                  />
                </div>
                <div class="file-info">
                  <div class="file-name">{{ file.name }}</div>
                  <small class="text-muted">{{
                    formatFileSize(file.size)
                  }}</small>
                </div>
                <div class="file-status ms-auto">
                  <div
                    v-if="file.status === 'processing'"
                    class="d-flex align-items-center"
                  >
                    <div
                      class="spinner-border spinner-border-sm me-1"
                      role="status"
                    ></div>
                    <small class="text-muted">Processando...</small>
                  </div>
                  <div
                    v-else-if="file.status === 'processed'"
                    class="text-success"
                  >
                    <CheckCircle :size="16" />
                  </div>
                  <div v-else-if="file.status === 'error'" class="text-danger">
                    <AlertCircle :size="16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="message.suggestions && message.suggestions.length > 0"
          class="message-suggestions"
        >
          <div class="suggestions-header">
            <small class="text-muted">Perguntas sugeridas:</small>
          </div>
          <div class="suggestions-list">
            <button
              v-for="suggestion in message.suggestions"
              :key="suggestion"
              class="btn btn-sm btn-outline-primary suggestion-btn"
              @click="$emit('send-suggested-question', suggestion)"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
        <div
          v-if="message.sources && message.sources.length > 0"
          class="message-sources"
        >
          <div class="sources-header">
            <small class="text-muted">Fontes:</small>
          </div>
          <div class="sources-list">
            <div
              v-for="source in message.sources"
              :key="source.id"
              class="source-item"
            >
              <div class="d-flex align-items-center">
                <FileText :size="14" class="text-muted me-2" />
                <span class="source-name">{{ source.name }}</span>
                <small class="text-muted ms-auto"
                  >Página {{ source.page }}</small
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  User,
  Bot,
  Paperclip,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-vue-next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import helpers from "../../../common/services/helpers.js";

export default {
  components: {
    User,
    Bot,
    Paperclip,
    FileText,
    CheckCircle,
    AlertCircle,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  emits: ["send-suggested-question"],
  methods: {
    formatTime(date) {
      return helpers.getDateFormattedWithSeconds(date);
    },
    formatMessageContent(content) {
      return content.replace(/\n/g, "<br>");
    },
    getFileIcon(type) {
      const ext = type.split("/").pop()?.toLowerCase();
      const icons = {
        pdf: FileText,
        msword: FileText,
        "vnd.openxmlformats-officedocument.wordprocessingml.document": FileText,
        plain: FileText,
        "vnd.ms-excel": FileText,
        "vnd.openxmlformats-officedocument.spreadsheetml.sheet": FileText,
        "vnd.ms-powerpoint": FileText,
        "vnd.openxmlformats-officedocument.presentationml.presentation":
          FileText,
      };
      return icons[ext || ""] || FileText;
    },
    getFileTypeColor(type) {
      const ext = type.split("/").pop()?.toLowerCase();
      const colors = {
        pdf: "text-danger",
        msword: "text-primary",
        "vnd.openxmlformats-officedocument.wordprocessingml.document":
          "text-primary",
        plain: "text-secondary",
        "vnd.ms-excel": "text-success",
        "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "text-success",
        "vnd.ms-powerpoint": "text-warning",
        "vnd.openxmlformats-officedocument.presentationml.presentation":
          "text-warning",
      };
      return colors[ext || ""] || "text-secondary";
    },
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },
  },
};
</script>

<style scoped>
.message-documents {
  margin-top: 8px;
  font-size: 0.92em;
  color: #6c757d;
}
.document-names {
  font-weight: 500;
  color: #495057;
}

.document-name {
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.2;
}
.user-message {
  flex-direction: row-reverse;
}
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}
.message-content {
  max-width: 70%;
  background-color: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.user-message .message-content {
  background-color: var(--primary-color);
  color: white;
}

.message-avatar {
  flex-shrink: 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-avatar {
  background-color: var(--primary-color);
}

.assistant-avatar {
  background-color: var(--secondary-color);
}

.message-sender {
  font-weight: 600;
  font-size: 0.875rem;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.message-text {
  line-height: 1.5;
}

.message-attachments {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.user-message .message-attachments {
  border-top-color: rgba(255, 255, 255, 0.2);
}
.attachments-header {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  display: flex;
  align-items: center;
}
.attachment-item {
  padding: var(--spacing-xs);
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xs);
}

.user-message .attachment-item {
  background-color: rgba(255, 255, 255, 0.1);
}

.file-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-light);
  border-radius: 4px;
}

.user-message .file-icon {
  background-color: rgba(255, 255, 255, 0.2);
}
.file-name {
  font-weight: 500;
  font-size: 0.875rem;
}

.message-suggestions {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.suggestions-header {
  margin-bottom: var(--spacing-xs);
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.suggestion-btn {
  font-size: 0.875rem;
  border-radius: 20px;
}
.message-sources {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.sources-header {
  margin-bottom: var(--spacing-xs);
}

.source-item {
  padding: var(--spacing-xs);
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xs);
}
</style>

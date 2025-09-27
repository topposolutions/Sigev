<template>
  <div class="chat-input">
    <div v-if="pendingFiles.length > 0" class="pending-files">
      <div class="pending-files-header">
        <span class="fw-semibold">Arquivos para anexar:</span>
        <button
          class="btn btn-sm btn-link text-danger"
          @click="$emit('clear-pending-files')"
        >
          <X :size="14" />
        </button>
      </div>
      <div class="pending-files-list">
        <div
          v-for="(file, index) in pendingFiles"
          :key="index"
          class="pending-file-item"
        >
          <div class="d-flex align-items-center">
            <component
              :is="getFileIcon(file.type)"
              :size="16"
              :class="getFileTypeColor(file.type)"
              class="me-2"
            />
            <span class="file-name">{{ file.name }}</span>
            <small class="text-muted ms-auto me-2">{{
              formatFileSize(file.size)
            }}</small>
            <button
              class="btn btn-sm btn-link text-danger p-0"
              @click="$emit('remove-pending-file', index)"
            >
              <X :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <form @submit.prevent="handleSubmit" class="input-form">
      <div class="input-group">
        <input
          ref="fileInput"
          type="file"
          multiple
          class="d-none"
          @change="onFileSelect"
          accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
        />
        <!--
         <button
          type="button"
          class="btn btn-outline-secondary paperclip-btn"
          @click="triggerFileInput"
          :disabled="isProcessing"
        >
          <Paperclip :size="16" />
        </button>
        -->
        <b-form-textarea
          type="text"
          class="form-control"
          placeholder="Digite sua pergunta sobre os documentos..."
          :value="currentMessage"
          :disabled="isProcessing"
          @input="$emit('update:currentMessage', $event)"
          @keydown.enter.exact.prevent="handleSubmit"
          rows="1"
          max-rows="5"
          no-resize
        />
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!canSendMessage"
        >
          <div v-if="isProcessing" class="d-flex align-items-center">
            <div
              class="spinner-border spinner-border-sm me-1"
              role="status"
            ></div>
          </div>
          <Send v-else :size="16" />
        </button>
      </div>
    </form>
    <!-- <div class="quick-actions">
      <button
        v-for="action in quickActions"
        :key="action.text"
        class="btn btn-sm btn-outline-secondary quick-action-btn"
        @click="$emit('send-quick-action', action.text)"
        :disabled="isProcessing || attachedDocuments.length === 0"
      >
        <component :is="action.icon" :size="14" class="me-1" />
        {{ action.text }}
      </button>
    </div> -->
  </div>
</template>

<script>
import { Paperclip, X, Send } from "lucide-vue-next";

export default {
  name: "ChatInput",
  components: {
    Paperclip,
    X,
    Send,
  },
  props: {
    pendingFiles: {
      type: Array,
      default: () => [],
    },
    isProcessing: {
      type: Boolean,
      default: false,
    },
    canSendMessage: {
      type: Boolean,
      default: false,
    },
    currentMessage: {
      type: String,
      default: "",
    },
    quickActions: {
      type: Array,
      default: () => [],
    },
    attachedDocuments: {
      type: Array,
      default: () => [],
    },
  },
  
  data() {
    return {
      fileInput: null,
    };
  },
  mounted() {
    this.fileInput = this.$refs.fileInput;
  },
  methods: {
    handleSubmit() {
      if (this.currentMessage && this.currentMessage.trim()) {
        this.$emit("send-message", this.currentMessage);
      }
    },
    getFileIcon(type) {
      return Paperclip;
    },
    getFileTypeColor(type) {
      return "";
    },
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },
    triggerFileInput() {
      if (this.fileInput) this.fileInput.click();
    },
    onFileSelect(event) {
      const target = event.target;
      const files = Array.from(target.files || []);
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      const validFiles = files.filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          alert(`Tipo de arquivo não suportado: ${file.name}`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          alert(`Arquivo muito grande: ${file.name}. Tamanho máximo: 10MB`);
          return false;
        }
        return true;
      });
      if (validFiles.length > 0) {
        this.$emit("files-selected", validFiles);
      }
      // Reset input
      if (target) target.value = "";
    },
  },
};
</script>

<style scoped>
.paperclip-btn {
  border-left: 1px solid #6c757d !important;
  border-radius: 0 !important;
}
.chat-input {
  margin-left: 5px;
  margin-right: 5px;
}

.chat-input {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  width: 100%;
  background: white;
  z-index: 10;
  border-top: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.pending-files {
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.pending-files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.pending-file-item {
  padding: var(--spacing-xs);
  background-color: white;
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-xs);
}

.pending-file-item:last-child {
  margin-bottom: 0;
}

.input-form {
  margin-bottom: var(--spacing-sm);
  margin-bottom: 20px;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.quick-action-btn {
  font-size: 0.875rem;
  border-radius: 20px;
}
</style>

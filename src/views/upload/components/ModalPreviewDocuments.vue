<template>
  <CeosModal
    :show="show"
    @close="$emit('close')"
    :header-title="'Preview dos Documentos'"
    :header-subtitle="`${documents.length} documento(s) selecionado(s)`"
    :header-icon="'bi bi-eye'"
    size="lg"
    :hide-footer="true"
    :show-ok-button="false"
    :show-cancel-button="false"
  >
    <div class="preview-modal-content">
      <!-- Controles de Navegação -->
      <div class="preview-modal-controls">
        <button
          class="btn btn-outline-secondary btn-sm"
          @click="previousPreview"
          :disabled="currentIndex === 0"
        >
          <i class="bi bi-chevron-left"></i>
          Anterior
        </button>
        <span class="preview-counter">
          {{ currentIndex + 1 }} de {{ documents.length }}
        </span>
        <button
          class="btn btn-outline-secondary btn-sm"
          @click="nextPreview"
          :disabled="currentIndex === documents.length - 1"
        >
          Próximo
          <i class="bi bi-chevron-right"></i>
        </button>
        <button
          class="btn btn-outline-danger btn-sm"
          @click="$emit('close')"
        >
          <i class="bi bi-x"></i>
          Fechar
        </button>
      </div>

      <!-- Conteúdo do Preview -->
      <div class="preview-modal-body" v-if="currentDocument">
        <div class="preview-header">
          <h5>{{ currentDocument.name }}</h5>
          <div class="preview-meta">
            <span class="file-type-badge">{{
              getFileType(currentDocument.type)
            }}</span>
            <span class="file-size-badge">{{
              formatFileSize(currentDocument.size)
            }}</span>
          </div>
        </div>

        <div class="preview-content">
          <!-- Preview de Imagem -->
          <div
            v-if="isImageFile(currentDocument.type)"
            class="image-preview"
          >
            <img
              :src="currentDocument.preview"
              :alt="currentDocument.name"
            />
          </div>

          <!-- Preview de PDF -->
          <div
            v-else-if="isPdfFile(currentDocument.type)"
            class="pdf-preview"
          >
            <div class="pdf-placeholder">
              <i class="bi bi-file-earmark-pdf"></i>
              <p>{{ currentDocument.name }}</p>
              <small
                >PDF - {{ formatFileSize(currentDocument.size) }}</small
              >
            </div>
          </div>

          <!-- Preview de Documento -->
          <div v-else class="document-preview">
            <div class="document-placeholder">
              <i :class="getFileIcon(currentDocument.type)"></i>
              <p>{{ currentDocument.name }}</p>
              <small>{{ getFileType(currentDocument.type) }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Miniaturas -->
      <div class="preview-thumbnails-modal">
        <div
          v-for="(document, index) in documents"
          :key="index"
          class="thumbnail-item"
          :class="{ active: index === currentIndex }"
          @click="setPreviewIndex(index)"
        >
          <div class="thumbnail-icon">
            <i :class="getFileIcon(document.type)"></i>
          </div>
          <div class="thumbnail-name">
            <CeosTooltip :text="document.name" :max-width="'200px'" position="top">
              <template #trigger>
                <span class="text-truncate">{{ document.name }}</span>
              </template>
            </CeosTooltip>
          </div>
        </div>
      </div>
    </div>
  </CeosModal>
</template>

<script>
import CeosModal from "../../../components/ceos-modal/CeosModal.vue";
import CeosTooltip from "../../../components/common/CeosTooltip.vue";

export default {
  name: "ModalPreviewDocuments",
  components: {
    CeosModal,
    CeosTooltip,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    documents: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  computed: {
    currentDocument() {
      return this.documents[this.currentIndex] || null;
    },
  },
  methods: {
    // Preview methods
    nextPreview() {
      if (this.currentIndex < this.documents.length - 1) {
        this.currentIndex++;
      }
    },

    previousPreview() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },

    setPreviewIndex(index) {
      this.currentIndex = index;
    },

    // Utility methods
    getFileIcon(type) {
      if (this.isImageFile(type)) return "bi bi-file-earmark-image";
      if (this.isPdfFile(type)) return "bi bi-file-earmark-pdf";
      if (type.includes("word") || type.includes("document"))
        return "bi bi-file-earmark-word";
      if (type.includes("excel") || type.includes("spreadsheet"))
        return "bi bi-file-earmark-excel";
      if (type.includes("powerpoint") || type.includes("presentation"))
        return "bi bi-file-earmark-ppt";
      if (type.includes("text")) return "bi bi-file-earmark-text";
      return "bi bi-file-earmark";
    },

    getFileType(type) {
      if (this.isImageFile(type)) return "Imagem";
      if (this.isPdfFile(type)) return "PDF";
      if (type.includes("word") || type.includes("document"))
        return "Documento";
      if (type.includes("excel") || type.includes("spreadsheet"))
        return "Planilha";
      if (type.includes("powerpoint") || type.includes("presentation"))
        return "Apresentação";
      if (type.includes("text")) return "Texto";
      return "Arquivo";
    },

    isImageFile(type) {
      return type.startsWith("image/");
    },

    isPdfFile(type) {
      return type === "application/pdf";
    },

    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },
  },

  watch: {
    show(newVal) {
      if (newVal) {
        this.currentIndex = 0;
      }
    },
  },
};
</script>

<style scoped>
/* Modal de Preview */
.preview-modal-content {
  padding: 1rem;
}

.preview-modal-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  gap: 1rem;
}

.preview-modal-controls .preview-counter {
  flex: 1;
  text-align: center;
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
}

.preview-modal-body {
  margin-bottom: 2rem;
}

.preview-header {
  margin-bottom: 2rem;
  text-align: center;
}

.preview-header h5 {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  word-break: break-word;
}

.preview-meta {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.file-type-badge,
.file-size-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.file-type-badge {
  background: #eff6ff;
  color: #3b82f6;
}

.file-size-badge {
  background: #f1f5f9;
  color: #64748b;
}

.preview-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.preview-content .image-preview img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.preview-content .pdf-placeholder,
.preview-content .document-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  color: #64748b;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  background: white;
}

.preview-content .pdf-placeholder i,
.preview-content .document-placeholder i {
  font-size: 4rem;
  color: #3b82f6;
}

.preview-content .pdf-placeholder p,
.preview-content .document-placeholder p {
  font-weight: 500;
  color: #1e293b;
  margin: 0;
  word-break: break-word;
}

.preview-content .pdf-placeholder small,
.preview-content .document-placeholder small {
  color: #64748b;
  line-height: 1.4;
}

.preview-thumbnails-modal {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
  border-top: 1px solid #e2e8f0;
}

.preview-thumbnails-modal .thumbnail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  background: white;
}

.preview-thumbnails-modal .thumbnail-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.preview-thumbnails-modal .thumbnail-item.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.preview-thumbnails-modal .thumbnail-icon {
  font-size: 2rem;
  color: #3b82f6;
}

.preview-thumbnails-modal .thumbnail-name {
  font-size: 0.75rem;
  color: #1e293b;
  text-align: center;
  max-width: 80px;
  width: 100%;
}

.preview-thumbnails-modal .thumbnail-name .text-truncate {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

/* Custom scrollbar para miniaturas do modal */
.preview-thumbnails-modal::-webkit-scrollbar {
  height: 6px;
}

.preview-thumbnails-modal::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.preview-thumbnails-modal::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.preview-thumbnails-modal::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

<template>
  <div class="upload-container">
    <!-- Header da página -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <i class="bi bi-cloud-upload me-3"></i>
            Upload de Documentos
          </h1>
          <p class="page-subtitle">
            Faça upload de seus documentos de forma segura e organizada
          </p>
        </div>
        <div class="header-right">
          <div class="upload-stats">
            <div class="stat-item">
              <span class="stat-number">{{ uploadedFiles.length }}</span>
              <span class="stat-label">Documentos</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ totalSize }}</span>
              <span class="stat-label">Tamanho Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="upload-content">
      <!-- Área de Upload -->
      <div class="upload-section">
        <div
          class="upload-area"
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          :class="{ 'drag-over': isDragOver }"
          @dragleave="isDragOver = false"
          @dragenter="isDragOver = true"
        >
          <div class="upload-zone" v-if="!uploadedFiles.length">
            <div class="upload-icon">
              <i class="bi bi-cloud-arrow-up"></i>
            </div>
            <h3>Arraste seus documentos aqui</h3>
            <p>ou clique para selecionar arquivos</p>
            <button class="btn btn-primary btn-lg" @click="triggerFileInput">
              <i class="bi bi-folder2-open me-2"></i>
              Selecionar Arquivos
            </button>
            <div class="supported-formats">
              <small class="text-muted"> Formatos suportados: PDF </small>
            </div>
          </div>

          <div class="upload-progress" v-else>
            <div class="progress-header">
              <h4>Documentos Selecionados</h4>
              <div class="progress-actions">
                <!-- 
                <button
                  class="btn btn-outline-info btn-sm me-2"
                  @click="openPreviewModal"
                >
                  <i class="bi bi-eye me-1"></i>
                  Preview
                </button>
                 -->
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="triggerFileInput"
                >
                  <i class="bi bi-plus"></i>
                  Adicionar
                </button>
              </div>
            </div>

            <div class="files-list">
              <div
                v-for="(file, index) in uploadedFiles"
                :key="index"
                class="file-item"
                :class="{
                  uploading: file.status === 'uploading',
                  success: file.status === 'success',
                  error: file.status === 'error',
                }"
              >
                <div class="file-info">
                  <div class="file-icon">
                    <i :class="getFileIcon(file.type)"></i>
                  </div>
                  <div class="file-details">
                    <div class="file-name">{{ file.name }}</div>
                    <div class="file-meta">
                      <span class="file-size">{{
                        formatFileSize(file.size)
                      }}</span>
                      <span class="file-type">{{
                        getFileType(file.type)
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="file-actions">
                  <div class="file-status" v-if="file.status === 'uploading'">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: file.progress + '%' }"
                      ></div>
                    </div>
                    <span class="progress-text">{{ file.progress }}%</span>
                  </div>

                  <div
                    class="status-icon"
                    v-else-if="file.status === 'success'"
                  >
                    <i class="bi bi-check-circle-fill text-success"></i>
                  </div>

                  <div class="status-icon" v-else-if="file.status === 'error'">
                    <i class="bi bi-x-circle-fill text-danger"></i>
                  </div>

                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="removeFile(index)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <input
            ref="fileInput"
            type="file"
            multiple
            @change="handleFileSelect"
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            style="display: none"
          />
        </div>
      </div>

      <div class="configuration-section" v-if="uploadedFiles.length">
        <div class="section-header">
          <h3>Configuração dos Documentos</h3>
          <p>Configure as propriedades dos documentos selecionados</p>
        </div>

        <div class="configuration-form">
          <div class="row g-4">
            <div class="col-md-12 mb-3">
              <ceos-select-multiple
                ref="accessRole"
                label="Roles de Acesso"
                :options="accessRoles"
                :limit="4"
                v-model="selectedAccessRoles"
                required
              >
                <template #label>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-shield-lock me-2"></i>
                    <span>Roles de Acesso</span>
                    <i
                      class="bi bi-question-circle ms-2 text-primary"
                      style="cursor: help; font-size: 14px"
                      title="É aqui onde você define quais áreas da empresa terão acesso aos documentos que estão sendo enviados para a plataforma. Você pode selecionar mais de uma área, porém se os documentos poderão ser acessados por todos os funcionários da empresa, selecione apenas a opção 'Público'."
                    ></i>
                  </div>
                </template>
              </ceos-select-multiple>
            </div>

            <div class="col-12">
              <ceos-input
                disabled
                v-model="documentDescription"
                label="Descrição"
                type="text"
                placeholder="Descreva brevemente o conteúdo dos documentos"
                :validate-on-blur="true"
                ref="documentDescription"
              >
                <template #label>
                  <i class="bi bi-card-text me-2"></i>
                  <span>Descrição</span>
                </template>
              </ceos-input>
            </div>

            <div class="col-12">
              <ceos-input
                disabled
                v-model="keywords"
                label="Palavras-chave"
                type="text"
                placeholder="Digite palavras-chave separadas por vírgula"
                :validate-on-blur="true"
                ref="keywords"
              >
                <template #label>
                  <i class="bi bi-tags me-2"></i>
                  <span>Palavras-chave</span>
                </template>
              </ceos-input>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" @click="clearAll">
              <i class="bi bi-arrow-clockwise me-2"></i>
              Limpar Tudo
            </button>
            <button
              class="btn btn-primary"
              @click="uploadDocuments"
              :disabled="!canUpload || uploading"
            >
              <i class="bi bi-cloud-upload me-2"></i>
              Enviar Documentos
              <span
                v-if="uploading"
                class="spinner-border spinner-border-sm ms-2"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Loading Overlay -->
    <GlobalLoadingOverlay />

    <!-- Modal de Preview -->
    <ModalPreviewDocuments
      :show="showPreviewModal"
      @close="showPreviewModal = false"
      :documents="uploadedFiles"
    />
  </div>
</template>

<script>
import CeosInput from "../../components/ceos-inputs/CeosInput.vue";
import CeosSelect from "../../components/ceos-inputs/CeosSelect.vue";
import GlobalLoadingOverlay from "../../components/common/GlobalLoadingOverlay.vue";
import ModalPreviewDocuments from "./components/ModalPreviewDocuments.vue";
import Swal from "sweetalert2";
import { useHtmlClassStore } from "../../stores/htmlclass.simple.store.js";
import DocumentsService from "../../common/services/documents/Documents.service";
const htmlClassStore = useHtmlClassStore();
import CeosSelectMultiple from "../../components/ceos-inputs/CeosSelectMultiple.vue";

export default {
  name: "DocumentUpload",
  components: {
    CeosInput,
    CeosSelect,
    GlobalLoadingOverlay,
    ModalPreviewDocuments,
    CeosSelectMultiple,
  },
  data() {
    return {
      statusSolicitationOptions: [
        {
          text: "Teste",
          value: "AWAITING_RELEASE",
        },
        {
          text: "YTes",
          value: "AWAITING_PART",
        },
      ],
      uploadedFiles: [],
      isDragOver: false,
      uploading: false,
      showPreviewModal: false,

      // Formulário
      documentType: null,
      accessRole: null,
      selectedAccessRoles: [],
      selectedStatus: [],
      documentDescription: "",
      keywords: "",

      // Opções
      documentTypes: [
        { value: "contrato", text: "Contrato" },
        { value: "relatorio", text: "Relatório" },
        { value: "proposta", text: "Proposta" },
        { value: "fatura", text: "Fatura" },
        { value: "manual", text: "Manual" },
        { value: "politica", text: "Política" },
        { value: "procedimento", text: "Procedimento" },
        { value: "outro", text: "Outro" },
      ],

      accessRoles: [
        { value: "admin", text: "Admin" },
        { value: "juridico", text: "Jurídico" },
        { value: "rh", text: "Recursos Humanos" },
        { value: "publico", text: "Público" },
      ],
    };
  },
  computed: {
    totalSize() {
      const total = this.uploadedFiles.reduce(
        (sum, file) => sum + file.size,
        0
      );
      return this.formatFileSize(total);
    },

    canUpload() {
      return this.uploadedFiles.length > 0;
    },
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      this.addFiles(files);
    },

    handleDrop(event) {
      this.isDragOver = false;
      const files = Array.from(event.dataTransfer.files);
      this.addFiles(files);
    },

    addFiles(files) {
      files.forEach((file) => {
        // Verificar se o arquivo já foi adicionado
        const exists = this.uploadedFiles.find(
          (f) => f.name === file.name && f.size === file.size
        );
        if (exists) return;

        // Criar preview apenas para imagens
        let preview = null;
        if (this.isImageFile(file.type)) {
          preview = URL.createObjectURL(file);
        }

        this.uploadedFiles.push({
          file: file,
          name: file.name,
          type: file.type,
          size: file.size,
          preview: preview,
          status: "pending",
          progress: 0,
        });
      });

      // Resetar o input
      this.$refs.fileInput.value = "";
    },

    removeFile(index) {
      const file = this.uploadedFiles[index];

      // Liberar URL do preview se existir
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }

      this.uploadedFiles.splice(index, 1);
    },

    clearAll() {
      this.uploadedFiles = [];
      this.documentType = null;
      this.accessRole = null;
      this.selectedAccessRoles = [];
      this.selectedStatus = [];
      this.documentDescription = "";
      this.keywords = "";
      // Liberar todas as URLs de preview
      this.uploadedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    },

    validateForm() {
      let arrayValidacao = [];
      arrayValidacao.push(this.$refs.accessRole.valid());
      console.log(arrayValidacao);
      return arrayValidacao.filter((elem) => elem == false).length == 0;
    },

    async uploadDocuments() {
      if (!this.canUpload || !this.validateForm()) return;

      this.uploading = true;
      htmlClassStore.startLoading();
      const roles = this.selectedAccessRoles
        .map((item) => item.value)
        .join(", ");

      DocumentsService.uploadAttachments(this.uploadedFiles, roles)
        .then((result) => {
          Swal.fire({
            title: this.$t("COMMONS.SUCCESS"),
            text: this.$t("COMMONS.SUCCESS_MESSAGE"),
            icon: "success",
          });
        })
        .catch((error) => {
          if (error.response?.data?.detail?.documentos?.length) {
            Swal.fire({
              title: this.$t("COMMONS.ERROR_TITLE"),
              text: this.$t(
                `DOCUMENTS.${error.response.data.detail.enTag.join(", ")}`,
                {
                  ANEXOS: error.response.data.detail.documentos.join(", "),
                }
              ),
              icon: "error",
            });
            return;
          }
          Swal.fire({
            title: this.$t("COMMONS.ERROR_TITLE"),
            text: this.$t("COMMONS.ERROR_MESSAGE"),
            icon: "error",
          });
          this.clearAll();
        })
        .finally(() => {
          this.uploading = false;
          htmlClassStore.stopLoading();
        });
    },

    // Preview methods
    openPreviewModal() {
      this.showPreviewModal = true;
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

  beforeUnmount() {
    // Limpar URLs de preview ao sair
    this.uploadedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
  },
};
</script>

<style scoped>
.upload-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

/* Header */
.page-header {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
}

.page-title i {
  color: #3b82f6;
  font-size: 2.5rem;
}

.page-subtitle {
  color: #64748b;
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
}

.upload-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Content */
.upload-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

/* Upload Section */
.upload-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.upload-area {
  border: 3px dashed #cbd5e1;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
  transform: scale(1.02);
}

.upload-zone {
  width: 100%;
}

.upload-icon {
  font-size: 4rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.upload-zone h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.upload-zone p {
  color: #64748b;
  margin-bottom: 2rem;
}

.supported-formats {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Files List */
.upload-progress {
  width: 100%;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.progress-header h4 {
  margin: 0;
  color: #1e293b;
  font-weight: 600;
}

.progress-actions {
  display: flex;
  gap: 0.5rem;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.file-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.file-item.uploading {
  border-color: #f59e0b;
  background: #fffbeb;
}

.file-item.success {
  border-color: #10b981;
  background: #ecfdf5;
}

.file-item.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.file-icon {
  font-size: 1.5rem;
  color: #3b82f6;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.file-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #64748b;
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  width: 60px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #64748b;
  min-width: 30px;
}

.status-icon {
  font-size: 1.25rem;
}

/* Configuration Section */
.configuration-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: #64748b;
  margin: 0;
}

.configuration-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Preview Section */
.preview-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.preview-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-carousel {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.carousel-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.preview-counter {
  font-weight: 500;
  color: #1e293b;
}

.preview-content {
  padding: 2rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-item {
  width: 100%;
  text-align: center;
}

.preview-header {
  margin-bottom: 2rem;
}

.preview-header h5 {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
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

.preview-body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.pdf-preview,
.document-preview {
  width: 100%;
}

.pdf-preview {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-placeholder,
.document-placeholder {
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
}

.pdf-placeholder i,
.document-placeholder i {
  font-size: 4rem;
  color: #3b82f6;
}

.pdf-placeholder p,
.document-placeholder p {
  font-weight: 500;
  color: #1e293b;
  margin: 0;
  word-break: break-word;
}

.pdf-placeholder small,
.document-placeholder small {
  color: #64748b;
  line-height: 1.4;
}

/* Thumbnails */
.preview-thumbnails {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail-item {
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

.thumbnail-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.thumbnail-item.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.thumbnail-icon {
  font-size: 2rem;
  color: #3b82f6;
}

.thumbnail-name {
  font-size: 0.75rem;
  color: #1e293b;
  text-align: center;
  word-break: break-word;
  max-width: 80px;
}

/* Responsive */
@media (max-width: 1200px) {
  .upload-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .upload-container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .upload-stats {
    justify-content: center;
  }

  .upload-area {
    padding: 2rem 1rem;
  }

  .file-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .file-actions {
    width: 100%;
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .preview-thumbnails {
    justify-content: center;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.upload-section,
.configuration-section,
.preview-section {
  animation: fadeIn 0.5s ease-out;
}

/* Custom scrollbar */
.preview-thumbnails::-webkit-scrollbar {
  height: 6px;
}

.preview-thumbnails::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.preview-thumbnails::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.preview-thumbnails::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

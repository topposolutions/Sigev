<template>
  <div class="document-sidebar" :class="{ show: show }">
    <div class="sidebar-header">
      <h6 class="mb-0">Documentos Anexados</h6>
      <button class="btn btn-sm btn-link" @click="$emit('toggle-sidebar')">
        <X :size="16" />
      </button>
    </div>

    <div class="sidebar-content">
      <div v-if="attachedDocuments.length === 0" class="text-center py-4">
        <FileText :size="48" class="text-muted mb-3" />
        <p class="text-muted">Nenhum documento anexado</p>
        <button
          class="btn btn-sm btn-primary"
          @click="$emit('trigger-file-input')"
        >
          <Plus :size="14" class="me-1" />
          Anexar Documento
        </button>
      </div>

      <div v-else class="attached-documents">
        <div
          v-for="doc in attachedDocuments"
          :key="doc.id"
          class="attached-document"
        >
          <div class="d-flex align-items-start">
            <component
              :is="getFileIcon(doc.type)"
              :size="20"
              :class="getFileTypeColor(doc.type)"
              class="me-2 mt-1"
            />
            <div class="flex-grow-1">
              <div class="document-name">{{ doc.name }}</div>
              <small class="text-muted">{{ formatFileSize(doc.size) }}</small>
              <div class="document-status mt-1">
                <span v-if="doc.status === 'processed'" class="badge bg-success"
                  >Processado</span
                >
                <span
                  v-else-if="doc.status === 'processing'"
                  class="badge bg-warning"
                  >Processando</span
                >
                <span v-else-if="doc.status === 'error'" class="badge bg-danger"
                  >Erro</span
                >
              </div>
            </div>
            <button
              class="btn btn-sm btn-link text-danger"
              @click="$emit('remove-document', doc.id)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import {
  FileText,
  Plus,
  X,
  Trash2,
  File,
  FileSpreadsheet,
} from "lucide-vue-next";

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "processed" | "error";
}

defineProps({
  attachedDocuments: {
    type: Array as () => AttachedFile[],
    default: () => [],
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits([
  "toggle-sidebar",
  "trigger-file-input",
  "remove-document",
]);

const getFileIcon = (type: string) => {
  const ext = type.split("/").pop()?.toLowerCase();
  const icons: Record<string, any> = {
    pdf: FileText,
    msword: File,
    "vnd.openxmlformats-officedocument.wordprocessingml.document": File,
    plain: FileText,
    "vnd.ms-excel": FileSpreadsheet,
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet": FileSpreadsheet,
    "vnd.ms-powerpoint": FileSpreadsheet,
    "vnd.openxmlformats-officedocument.presentationml.presentation":
      FileSpreadsheet,
  };
  return icons[ext || ""] || FileText;
};

const getFileTypeColor = (type: string) => {
  const ext = type.split("/").pop()?.toLowerCase();
  const colors: Record<string, string> = {
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
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>

<style scoped>
.document-sidebar {
  position: absolute;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100%;
  background-color: white;
  border-left: 1px solid var(--border-color);
  transition: right 0.3s ease;
  z-index: 1000;
}

.document-sidebar.show {
  right: 0;
}

.sidebar-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-content {
  padding: var(--spacing-md);
  height: calc(100% - 60px);
  overflow-y: auto;
}

.attached-document {
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-sm);
  background-color: var(--bg-light);
}

.document-name {
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.2;
}

/* Adicionar estilos para badges */
.badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.document-name {
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.2;
}
.bg-success {
  background-color: #28a745 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
  color: #212529 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.document-sidebar {
  position: absolute;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100%;
  background-color: white;
  border-left: 1px solid var(--border-color);
  transition: right 0.3s ease;
  z-index: 1000;
}

.document-sidebar.show {
  right: 0;
}
.attached-document {
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-sm);
  background-color: var(--bg-light);
}
</style>

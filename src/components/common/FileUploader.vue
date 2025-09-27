<template>
  <div class="upload-zone" :class="{ 'drag-over': isDragOver }" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
    <div class="d-flex flex-column align-items-center justify-content-center py-4">
      <i class="bi bi-cloud-arrow-up display-5 mb-2"></i>
      <div class="mb-2">Arraste e solte arquivos aqui ou <span class="text-primary" @click="triggerInput" style="cursor:pointer;">clique para selecionar</span></div>
      <input ref="fileInput" type="file" class="d-none" :accept="accept" multiple @change="onFileChange" />
      <div class="small text-secondary">Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX</div>
    </div>
    <div v-if="files.length" class="mt-3">
      <div v-for="(file, idx) in files" :key="file.name + idx" class="document-item card p-2 mb-2 d-flex flex-row align-items-center gap-3">
        <i :class="fileIcon(file) + ' fs-4'" />
        <div class="flex-grow-1">
          <div class="fw-semibold">{{ file.name }}</div>
          <div class="small text-secondary">{{ formatSize(file.size) }}</div>
          <div class="mt-1">
            <span class="badge bg-secondary me-2">{{ file.type || 'Desconhecido' }}</span>
            <select v-model="file.profile" class="form-select form-select-sm d-inline w-auto">
              <option value="publico">Público</option>
              <option value="restrito">Restrito</option>
              <option value="confidencial">Confidencial</option>
            </select>
          </div>
        </div>
        <button class="btn btn-outline-danger btn-sm" @click="removeFile(idx)"><i class="bi bi-trash"></i></button>
      </div>
      <div class="progress mt-2" v-if="uploading">
        <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{ width: progress + '%' }">{{ progress }}%</div>
      </div>
      <button class="btn btn-primary mt-3 w-100" :disabled="uploading" @click="mockUpload">Enviar Arquivos</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const accept = '.pdf,.doc,.docx,.xls,.xlsx';
const files = ref([]);
const isDragOver = ref(false);
const uploading = ref(false);
const progress = ref(0);
const fileInput = ref(null);

function triggerInput() {
  fileInput.value.click();
}

function onFileChange(e) {
  handleFiles(e.target.files);
  e.target.value = '';
}

function onDragOver() {
  isDragOver.value = true;
}
function onDragLeave() {
  isDragOver.value = false;
}
function onDrop(e) {
  isDragOver.value = false;
  handleFiles(e.dataTransfer.files);
}

function handleFiles(fileList) {
  for (const file of fileList) {
    if (!accept.includes(file.name.split('.').pop().toLowerCase())) continue;
    files.value.push({ ...file, profile: 'publico' });
  }
}

function removeFile(idx) {
  files.value.splice(idx, 1);
}

function formatSize(size) {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  return (size / (1024 * 1024)).toFixed(1) + ' MB';
}

function fileIcon(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'bi bi-file-earmark-pdf text-danger';
  if (['doc', 'docx'].includes(ext)) return 'bi bi-file-earmark-word text-primary';
  if (['xls', 'xlsx'].includes(ext)) return 'bi bi-file-earmark-excel text-success';
  return 'bi bi-file-earmark';
}

function mockUpload() {
  uploading.value = true;
  progress.value = 0;
  const interval = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(interval);
      uploading.value = false;
      progress.value = 0;
      files.value = [];
      // Aqui pode emitir um evento de sucesso
    } else {
      progress.value += 10;
    }
  }, 150);
}
</script>

<style scoped>
.upload-zone {
  min-height: 180px;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-light);
  transition: all 0.2s ease;
  cursor: pointer;
}
.upload-zone.drag-over {
  border-color: var(--primary-color);
  background-color: var(--bg-dark);
  color: var(--text-light);
}
.document-item {
  background: var(--primary-light);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}
</style> 
<template>
  <div class="upload-page">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-semibold text-dark mb-1">Upload de Documentos</h4>
        <p class="text-muted mb-0">Adicione novos documentos à plataforma</p>
      </div>
      <router-link to="/documents" class="btn btn-outline-secondary">
        <ArrowLeft :size="16" class="me-2" />
        Voltar aos Documentos
      </router-link>
    </div>

    <div class="row">
      <!-- Upload Area -->
      <div class="col-lg-8 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Selecionar Arquivos</h5>
          </div>
          <div class="card-body">
            <!-- Drag & Drop Zone -->
            <div 
              class="upload-zone"
              :class="{ 'drag-over': isDragOver }"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                multiple
                class="d-none"
                @change="handleFileSelect"
                accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
              >
              
              <div class="text-center py-5">
                <Upload :size="48" class="text-muted mb-3" />
                <h5 class="mb-2">Arraste arquivos aqui ou clique para selecionar</h5>
                <p class="text-muted mb-3">
                  Formatos aceitos: PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX
                </p>
                <p class="text-muted small">
                  Tamanho máximo: 10MB por arquivo
                </p>
              </div>
            </div>

            <!-- Selected Files List -->
            <div v-if="selectedFiles.length > 0" class="mt-4">
              <h6 class="mb-3">Arquivos Selecionados ({{ selectedFiles.length }})</h6>
              <div class="selected-files">
                <div 
                  v-for="(file, index) in selectedFiles" 
                  :key="index"
                  class="file-item d-flex align-items-center justify-content-between p-3 mb-2 border rounded"
                >
                  <div class="d-flex align-items-center">
                    <div class="file-icon me-3">
                      <component :is="getFileIcon(file)" :size="24" :class="getFileTypeColor(file)" />
                    </div>
                    <div>
                      <div class="fw-semibold">{{ file.name }}</div>
                      <small class="text-muted">{{ formatFileSize(file.size) }}</small>
                    </div>
                  </div>
                  
                  <div class="d-flex align-items-center">
                    <div class="upload-status me-3" v-if="file.uploadStatus">
                      <div v-if="file.uploadStatus === 'uploading'" class="d-flex align-items-center">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        <span class="small text-muted">{{ file.progress || 0 }}%</span>
                      </div>
                      <div v-else-if="file.uploadStatus === 'success'" class="text-success">
                        <CheckCircle :size="16" />
                      </div>
                      <div v-else-if="file.uploadStatus === 'error'" class="text-danger">
                        <AlertCircle :size="16" />
                      </div>
                    </div>
                    
                    <button 
                      class="btn btn-sm btn-outline-danger"
                      @click="removeFile(index)"
                      :disabled="file.uploadStatus === 'uploading'"
                    >
                      <X :size="14" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Information -->
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Informações do Documento</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="uploadFiles">
              <div class="mb-3">
                <label class="form-label">Categoria</label>
                <select class="form-select" v-model="documentInfo.category" required>
                  <option value="">Selecione uma categoria</option>
                  <option value="Operações">Operações</option>
                  <option value="TI">TI</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="RH">RH</option>
                  <option value="Jurídico">Jurídico</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Nível de Acesso</label>
                <select class="form-select" v-model="documentInfo.accessLevel" required>
                  <option value="public">Público</option>
                  <option value="restricted">Restrito</option>
                  <option value="confidential">Confidencial</option>
                </select>
                <div class="form-text">
                  <small v-if="documentInfo.accessLevel === 'public'">Visível para todos os usuários</small>
                  <small v-else-if="documentInfo.accessLevel === 'restricted'">Visível apenas para usuários autorizados</small>
                  <small v-else-if="documentInfo.accessLevel === 'confidential'">Visível apenas para administradores</small>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Tags</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="tagsInput"
                  placeholder="Ex: manual, procedimento, operacional"
                  @keyup.enter="addTag"
                >
                <div class="form-text">Pressione Enter para adicionar tags</div>
                
                <div class="mt-2" v-if="documentInfo.tags.length > 0">
                  <span 
                    v-for="(tag, index) in documentInfo.tags" 
                    :key="index"
                    class="badge bg-primary me-1 mb-1"
                  >
                    {{ tag }}
                    <button type="button" class="btn-close btn-close-white ms-1" @click="removeTag(index)"></button>
                  </span>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Descrição (Opcional)</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="documentInfo.description"
                  placeholder="Descrição breve do documento..."
                ></textarea>
              </div>

              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="selectedFiles.length === 0 || isUploading || !documentInfo.category || !documentInfo.accessLevel"
                >
                  <div v-if="isUploading" class="d-flex align-items-center justify-content-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    Enviando...
                  </div>
                  <div v-else class="d-flex align-items-center justify-content-center">
                    <Upload :size="16" class="me-2" />
                    Enviar {{ selectedFiles.length }} arquivo{{ selectedFiles.length !== 1 ? 's' : '' }}
                  </div>
                </button>
                
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  @click="clearAll"
                  :disabled="isUploading"
                >
                  Limpar Tudo
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Upload Tips -->
        <div class="card mt-4">
          <div class="card-header">
            <h6 class="mb-0">Dicas de Upload</h6>
          </div>
          <div class="card-body">
            <div class="upload-tips">
              <div class="tip-item mb-3">
                <CheckCircle :size="16" class="text-success me-2" />
                <span>Use nomes descritivos para os arquivos</span>
              </div>
              <div class="tip-item mb-3">
                <CheckCircle :size="16" class="text-success me-2" />
                <span>Adicione tags relevantes para facilitar a busca</span>
              </div>
              <div class="tip-item mb-3">
                <CheckCircle :size="16" class="text-success me-2" />
                <span>Escolha a categoria correta</span>
              </div>
              <div class="tip-item">
                <CheckCircle :size="16" class="text-success me-2" />
                <span>Defina o nível de acesso apropriado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Upload, 
  ArrowLeft, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  File,
  FileSpreadsheet,
  Image
} from 'lucide-vue-next'
import { useDocumentsStore } from '../stores/documents'

const router = useRouter()
const documentsStore = useDocumentsStore()

const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<any[]>([])
const isDragOver = ref(false)
const isUploading = ref(false)
const tagsInput = ref('')

const documentInfo = reactive({
  category: '',
  accessLevel: 'public',
  tags: [] as string[],
  description: ''
})

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(e.dataTransfer?.files || [])
  addFiles(files)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  addFiles(files)
}

const addFiles = (files: File[]) => {
  const validFiles = files.filter(file => {
    // Validar tipo de arquivo
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      alert(`Tipo de arquivo não suportado: ${file.name}`)
      return false
    }
    
    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(`Arquivo muito grande: ${file.name}. Tamanho máximo: 10MB`)
      return false
    }
    
    return true
  })
  
  const newFiles = validFiles.map(file => ({
    ...file,
    uploadStatus: null,
    progress: 0
  }))
  
  selectedFiles.value.push(...newFiles)
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const addTag = () => {
  const tag = tagsInput.value.trim()
  if (tag && !documentInfo.tags.includes(tag)) {
    documentInfo.tags.push(tag)
    tagsInput.value = ''
  }
}

const removeTag = (index: number) => {
  documentInfo.tags.splice(index, 1)
}

const getFileIcon = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  const icons: Record<string, any> = {
    'pdf': FileText,
    'doc': File,
    'docx': File,
    'txt': FileText,
    'xls': FileSpreadsheet,
    'xlsx': FileSpreadsheet,
    'ppt': FileSpreadsheet,
    'pptx': FileSpreadsheet
  }
  return icons[ext || ''] || FileText
}

const getFileTypeColor = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  const colors: Record<string, string> = {
    'pdf': 'text-danger',
    'doc': 'text-primary',
    'docx': 'text-primary',
    'txt': 'text-secondary',
    'xls': 'text-success',
    'xlsx': 'text-success',
    'ppt': 'text-warning',
    'pptx': 'text-warning'
  }
  return colors[ext || ''] || 'text-secondary'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return
  
  isUploading.value = true
  
  // Simular upload de arquivos
  for (let i = 0; i < selectedFiles.value.length; i++) {
    const file = selectedFiles.value[i]
    file.uploadStatus = 'uploading'
    
    // Simular progresso de upload
    for (let progress = 0; progress <= 100; progress += 10) {
      file.progress = progress
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    try {
      // Simular possível erro
      if (Math.random() < 0.1) { // 10% chance de erro
        throw new Error('Erro no upload')
      }
      
      // Adicionar documento à store
      const newDocument = {
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extensão
        type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        size: file.size,
        lastModified: new Date(),
        tags: [...documentInfo.tags],
        category: documentInfo.category,
        status: 'active' as const,
        accessLevel: documentInfo.accessLevel as 'public' | 'restricted' | 'confidential'
      }
      
      documentsStore.addDocument(newDocument)
      file.uploadStatus = 'success'
      
    } catch (error) {
      file.uploadStatus = 'error'
    }
  }
  
  isUploading.value = false
  
  // Verificar se todos os uploads foram bem-sucedidos
  const successfulUploads = selectedFiles.value.filter(f => f.uploadStatus === 'success').length
  
  if (successfulUploads > 0) {
    alert(`${successfulUploads} arquivo(s) enviado(s) com sucesso!`)
    
    setTimeout(() => {
      router.push('/documents')
    }, 2000)
  }
}

const clearAll = () => {
  selectedFiles.value = []
  documentInfo.category = ''
  documentInfo.accessLevel = 'public'
  documentInfo.tags = []
  documentInfo.description = ''
  tagsInput.value = ''
}
</script>

<style scoped>
.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: var(--primary-color);
  background-color: rgba(13, 110, 253, 0.05);
}

.file-item {
  background-color: var(--bg-light);
  transition: all 0.2s ease;
}

.file-item:hover {
  background-color: rgba(13, 110, 253, 0.05);
}

.file-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  font-size: 0.9rem;
}

.badge .btn-close {
  font-size: 0.6em;
  opacity: 0.8;
}

.badge .btn-close:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .upload-zone {
    padding: var(--spacing-md) !important;
  }
  
  .file-item {
    flex-direction: column;
    align-items: flex-start !important;
    gap: var(--spacing-sm);
  }
  
  .file-item .d-flex:last-child {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
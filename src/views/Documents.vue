<template>
  <div class="documents-page">
    <!-- Header Actions -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-semibold text-dark mb-1">Documentos</h4>
        <p class="text-muted mb-0">{{ documentsStore.filteredDocuments.length }} documentos encontrados</p>
      </div>
      <router-link to="/upload" class="btn btn-primary">
        <Plus :size="16" class="me-2" />
        Adicionar Documento
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-4 mb-3 mb-md-0">
            <div class="input-group">
              <span class="input-group-text">
                <Search :size="16" />
              </span>
              <input
                type="text"
                class="form-control search-box"
                placeholder="Buscar documentos..."
                v-model="searchQuery"
                @input="handleSearch"
              >
            </div>
          </div>
          
          <div class="col-md-8">
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <span class="text-muted small me-2">Filtrar por:</span>
              
              <!-- Category Filter -->
              <div class="dropdown">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                  {{ selectedCategory || 'Categoria' }}
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" @click="setCategory('')">Todas as categorias</a></li>
                  <li v-for="category in documentsStore.categories" :key="category">
                    <a class="dropdown-item" @click="setCategory(category)">{{ category }}</a>
                  </li>
                </ul>
              </div>

              <!-- Type Filter -->
              <div class="dropdown">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                  {{ selectedType || 'Tipo' }}
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" @click="setType('')">Todos os tipos</a></li>
                  <li v-for="type in documentsStore.documentTypes" :key="type">
                    <a class="dropdown-item" @click="setType(type)">{{ type }}</a>
                  </li>
                </ul>
              </div>

              <!-- Clear Filters -->
              <button 
                class="btn btn-link btn-sm text-decoration-none"
                @click="clearAllFilters"
                v-if="hasActiveFilters"
              >
                <X :size="14" class="me-1" />
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Documents Grid -->
    <div class="row" v-if="!documentsStore.isLoading">
      <div class="col-xl-3 col-lg-4 col-md-6 mb-4" v-for="document in documentsStore.filteredDocuments" :key="document.id">
        <div class="card h-100 document-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="file-type-icon">
                <component :is="getFileIcon(document.type)" :size="24" :class="getFileTypeColor(document.type)" />
              </div>
              <div class="dropdown">
                <button class="btn btn-sm btn-link text-muted" data-bs-toggle="dropdown">
                  <MoreVertical :size="16" />
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" @click="viewDocument(document)">
                    <Eye :size="14" class="me-2" />Visualizar
                  </a></li>
                  <li><a class="dropdown-item" @click="downloadDocument(document)">
                    <Download :size="14" class="me-2" />Baixar
                  </a></li>
                  <li><a class="dropdown-item" @click="editDocument(document)">
                    <Edit :size="14" class="me-2" />Editar
                  </a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item text-danger" @click="deleteDocument(document)">
                    <Trash2 :size="14" class="me-2" />Excluir
                  </a></li>
                </ul>
              </div>
            </div>

            <h6 class="card-title mb-2">{{ document.title }}</h6>
            <p class="text-muted small mb-3">{{ formatFileSize(document.size) }}</p>

            <div class="mb-3">
              <span class="badge bg-light text-dark me-1">{{ document.category }}</span>
              <span class="badge" :class="getAccessLevelClass(document.accessLevel)">
                {{ formatAccessLevel(document.accessLevel) }}
              </span>
            </div>

            <div class="document-meta">
              <div class="d-flex justify-content-between align-items-center text-muted small">
                <span>{{ formatDate(document.uploadDate) }}</span>
                <span class="d-flex align-items-center">
                  <Download :size="12" class="me-1" />
                  {{ document.downloadCount }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer bg-transparent">
            <div class="d-flex gap-2">
              <button class="btn btn-primary btn-sm flex-grow-1" @click="viewDocument(document)">
                <Eye :size="14" class="me-1" />
                Visualizar
              </button>
              <button class="btn btn-outline-secondary btn-sm" @click="downloadDocument(document)">
                <Download :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="documentsStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="text-muted mt-3">Carregando documentos...</p>
    </div>

    <!-- Empty State -->
    <div v-if="!documentsStore.isLoading && documentsStore.filteredDocuments.length === 0" class="text-center py-5">
      <FileText :size="64" class="text-muted mb-3" />
      <h5 class="text-muted">Nenhum documento encontrado</h5>
      <p class="text-muted">Tente alterar os filtros ou adicione novos documentos.</p>
      <router-link to="/upload" class="btn btn-primary">
        <Plus :size="16" class="me-2" />
        Adicionar Primeiro Documento
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Search, 
  Plus, 
  Eye, 
  Download, 
  Edit, 
  Trash2, 
  MoreVertical, 
  X,
  FileText,
  File,
  Image,
  FileSpreadsheet
} from 'lucide-vue-next'
import { useDocumentsStore } from '../stores/documents'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const documentsStore = useDocumentsStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedType = ref('')

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value || selectedType.value
})

const handleSearch = () => {
  documentsStore.setSearchQuery(searchQuery.value)
}

const setCategory = (category: string) => {
  selectedCategory.value = category
  documentsStore.setSelectedCategory(category)
}

const setType = (type: string) => {
  selectedType.value = type
  documentsStore.setSelectedType(type)
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedType.value = ''
  documentsStore.clearFilters()
}

const getFileIcon = (type: string) => {
  const icons: Record<string, any> = {
    'PDF': FileText,
    'DOCX': File,
    'TXT': FileText,
    'XLSX': FileSpreadsheet,
    'PNG': Image,
    'JPG': Image
  }
  return icons[type] || FileText
}

const getFileTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'PDF': 'text-danger',
    'DOCX': 'text-primary',
    'TXT': 'text-secondary',
    'XLSX': 'text-success',
    'PNG': 'text-info',
    'JPG': 'text-info'
  }
  return colors[type] || 'text-secondary'
}

const getAccessLevelClass = (level: string) => {
  const classes: Record<string, string> = {
    'public': 'bg-success',
    'restricted': 'bg-warning',
    'confidential': 'bg-danger'
  }
  return classes[level] || 'bg-secondary'
}

const formatAccessLevel = (level: string) => {
  const labels: Record<string, string> = {
    'public': 'Público',
    'restricted': 'Restrito',
    'confidential': 'Confidencial'
  }
  return labels[level] || level
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: Date) => {
  return format(date, 'dd MMM yyyy', { locale: ptBR })
}

const viewDocument = (document: any) => {
  console.log('Visualizando documento:', document.title)
  // Implementar modal de visualização
}

const downloadDocument = (document: any) => {
  documentsStore.incrementDownloadCount(document.id)
  console.log('Baixando documento:', document.title)
  // Implementar download
}

const editDocument = (document: any) => {
  console.log('Editando documento:', document.title)
  // Implementar edição
}

const deleteDocument = (document: any) => {
  if (confirm(`Tem certeza que deseja excluir "${document.title}"?`)) {
    documentsStore.deleteDocument(document.id)
  }
}

onMounted(() => {
  // Inicializar dados se necessário
})
</script>

<style scoped>
.document-card {
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.document-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.file-type-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
}

.document-meta {
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.search-box:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

@media (max-width: 768px) {
  .document-card {
    margin-bottom: var(--spacing-md);
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
  }
  
  .d-flex.gap-2 .btn {
    width: 100%;
  }
}
</style>
<template>
  <div class="search-page">
    <!-- Search Header -->
    <div class="search-header mb-4">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <div class="search-container">
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-white">
                <Search :size="20" class="text-muted" />
              </span>
              <input
                type="text"
                class="form-control search-input"
                placeholder="Digite sua pergunta ou busque por documentos..."
                v-model="searchQuery"
                @keyup.enter="performSearch"
                @input="handleSearchInput"
              >
              <button class="btn btn-primary" @click="performSearch" :disabled="!searchQuery.trim()">
                Buscar
              </button>
            </div>
            
            <!-- Search Suggestions -->
            <div class="search-suggestions mt-2" v-if="showSuggestions && suggestions.length > 0">
              <div class="card border-0 shadow-sm">
                <div class="list-group list-group-flush">
                  <button 
                    v-for="suggestion in suggestions" 
                    :key="suggestion.id"
                    class="list-group-item list-group-item-action d-flex align-items-center"
                    @click="selectSuggestion(suggestion)"
                  >
                    <Search :size="16" class="text-muted me-2" />
                    <span>{{ suggestion.text }}</span>
                    <small class="text-muted ms-auto">{{ suggestion.count }} resultados</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4 mt-3 mt-lg-0">
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-outline-secondary" @click="toggleAdvancedSearch">
              <Filter :size="16" class="me-1" />
              Filtros Avançados
            </button>
            <button class="btn btn-outline-secondary" @click="clearSearch" v-if="hasResults">
              <X :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Search Filters -->
    <div class="card mb-4" v-if="showAdvancedSearch">
      <div class="card-header">
        <h6 class="mb-0">Filtros Avançados</h6>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-3 mb-3">
            <label class="form-label">Categoria</label>
            <select class="form-select" v-model="filters.category">
              <option value="">Todas as categorias</option>
              <option v-for="category in documentsStore.categories" :key="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="col-md-3 mb-3">
            <label class="form-label">Tipo de Arquivo</label>
            <select class="form-select" v-model="filters.type">
              <option value="">Todos os tipos</option>
              <option v-for="type in documentsStore.documentTypes" :key="type">
                {{ type }}
              </option>
            </select>
          </div>
          
          <div class="col-md-3 mb-3">
            <label class="form-label">Data (De)</label>
            <input type="date" class="form-control" v-model="filters.dateFrom">
          </div>
          
          <div class="col-md-3 mb-3">
            <label class="form-label">Data (Até)</label>
            <input type="date" class="form-control" v-model="filters.dateTo">
          </div>
        </div>
        
        <div class="d-flex gap-2">
          <button class="btn btn-primary" @click="applyFilters">
            Aplicar Filtros
          </button>
          <button class="btn btn-outline-secondary" @click="clearFilters">
            Limpar
          </button>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="hasSearched">
      <!-- Results Summary -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="mb-1">Resultados da Busca</h5>
          <p class="text-muted mb-0">
            {{ searchResults.length }} resultado{{ searchResults.length !== 1 ? 's' : '' }} 
            encontrado{{ searchResults.length !== 1 ? 's' : '' }}
            <span v-if="searchQuery"> para "{{ searchQuery }}"</span>
          </p>
        </div>
        
        <div class="d-flex align-items-center gap-3">
          <span class="text-muted small">Ordenar por:</span>
          <select class="form-select form-select-sm" style="width: auto;" v-model="sortBy" @change="sortResults">
            <option value="relevance">Relevância</option>
            <option value="date">Data</option>
            <option value="title">Título</option>
            <option value="downloads">Downloads</option>
          </select>
        </div>
      </div>

      <!-- Results List -->
      <div class="search-results">
        <div v-if="isSearching" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Buscando...</span>
          </div>
          <p class="text-muted mt-3">Processando sua consulta...</p>
        </div>

        <div v-else-if="searchResults.length === 0" class="text-center py-5">
          <Search :size="64" class="text-muted mb-3" />
          <h5 class="text-muted">Nenhum resultado encontrado</h5>
          <p class="text-muted">Tente usar termos diferentes ou remover alguns filtros.</p>
        </div>

        <div v-else>
          <div v-for="result in searchResults" :key="result.id" class="card mb-3 search-result-item">
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <div class="d-flex align-items-start">
                    <div class="file-icon me-3">
                      <component :is="getFileIcon(result.type)" :size="24" :class="getFileTypeColor(result.type)" />
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-2">
                        <a href="#" @click="viewDocument(result)" class="text-decoration-none">
                          {{ result.title }}
                        </a>
                      </h6>
                      
                      <div class="search-snippet mb-2" v-if="result.snippet">
                        <p class="text-muted mb-0">{{ result.snippet }}</p>
                      </div>
                      
                      <div class="result-meta d-flex flex-wrap gap-3 small text-muted">
                        <span>
                          <Calendar :size="14" class="me-1" />
                          {{ formatDate(result.uploadDate) }}
                        </span>
                        <span>
                          <FolderOpen :size="14" class="me-1" />
                          {{ result.category }}
                        </span>
                        <span>
                          <FileText :size="14" class="me-1" />
                          {{ result.type }} • {{ formatFileSize(result.size) }}
                        </span>
                        <span>
                          <Download :size="14" class="me-1" />
                          {{ result.downloadCount }} downloads
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-4 text-md-end mt-3 mt-md-0">
                  <div class="d-flex flex-column align-items-md-end gap-2">
                    <div class="tags">
                      <span v-for="tag in result.tags.slice(0, 3)" :key="tag" class="badge bg-light text-dark me-1">
                        {{ tag }}
                      </span>
                    </div>
                    
                    <div class="actions">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="viewDocument(result)">
                          <Eye :size="14" class="me-1" />
                          Ver
                        </button>
                        <button class="btn btn-outline-secondary" @click="downloadDocument(result)">
                          <Download :size="14" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Popular Searches (shown when no search performed) -->
    <div v-else class="popular-searches">
      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Buscas Populares</h6>
            </div>
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2">
                <button 
                  v-for="search in popularSearches" 
                  :key="search.id"
                  class="btn btn-outline-secondary btn-sm"
                  @click="performQuickSearch(search.query)"
                >
                  {{ search.query }}
                  <span class="badge bg-secondary ms-1">{{ search.count }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4 mt-4 mt-lg-0">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Dicas de Busca</h6>
            </div>
            <div class="card-body">
              <div class="search-tips">
                <div class="tip-item mb-3">
                  <strong>Use aspas</strong> para buscar frases exatas
                  <br>
                  <small class="text-muted">Exemplo: "política de segurança"</small>
                </div>
                <div class="tip-item mb-3">
                  <strong>Use filtros</strong> para refinar resultados
                  <br>
                  <small class="text-muted">Filtre por categoria ou tipo de arquivo</small>
                </div>
                <div class="tip-item">
                  <strong>Palavras-chave</strong> funcionam melhor
                  <br>
                  <small class="text-muted">Use termos específicos relacionados ao conteúdo</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Search, 
  Filter, 
  X, 
  Eye, 
  Download, 
  Calendar, 
  FolderOpen, 
  FileText,
  File,
  FileSpreadsheet,
  Image
} from 'lucide-vue-next'
import { useDocumentsStore } from '../stores/documents'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const documentsStore = useDocumentsStore()

const searchQuery = ref('')
const showSuggestions = ref(false)
const showAdvancedSearch = ref(false)
const hasSearched = ref(false)
const isSearching = ref(false)
const sortBy = ref('relevance')

const filters = ref({
  category: '',
  type: '',
  dateFrom: '',
  dateTo: ''
})

const suggestions = ref([
  { id: 1, text: 'manual de procedimentos', count: 5 },
  { id: 2, text: 'política de segurança', count: 3 },
  { id: 3, text: 'relatório anual', count: 8 }
])

const popularSearches = ref([
  { id: 1, query: 'manual', count: 24 },
  { id: 2, query: 'política', count: 18 },
  { id: 3, query: 'relatório', count: 15 },
  { id: 4, query: 'procedimentos', count: 12 },
  { id: 5, query: 'segurança', count: 9 }
])

const searchResults = ref<any[]>([])

const hasResults = computed(() => hasSearched.value && searchResults.value.length > 0)

const handleSearchInput = () => {
  showSuggestions.value = searchQuery.value.length > 2
}

const selectSuggestion = (suggestion: any) => {
  searchQuery.value = suggestion.text
  showSuggestions.value = false
  performSearch()
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  hasSearched.value = true
  showSuggestions.value = false
  
  // Simular busca com delay
  setTimeout(() => {
    // Filtrar documentos baseado na query
    let results = documentsStore.documents.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    
    // Aplicar filtros adicionais
    if (filters.value.category) {
      results = results.filter(doc => doc.category === filters.value.category)
    }
    
    if (filters.value.type) {
      results = results.filter(doc => doc.type === filters.value.type)
    }
    
    // Adicionar snippet simulado
    results = results.map(doc => ({
      ...doc,
      snippet: `...${doc.title} contém informações relevantes sobre ${searchQuery.value}...`
    }))
    
    searchResults.value = results
    isSearching.value = false
    sortResults()
  }, 1000)
}

const performQuickSearch = (query: string) => {
  searchQuery.value = query
  performSearch()
}

const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value
}

const applyFilters = () => {
  performSearch()
}

const clearFilters = () => {
  filters.value = {
    category: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  clearFilters()
}

const sortResults = () => {
  switch (sortBy.value) {
    case 'date':
      searchResults.value.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
      break
    case 'title':
      searchResults.value.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'downloads':
      searchResults.value.sort((a, b) => b.downloadCount - a.downloadCount)
      break
    default: // relevance
      // Manter ordem original (simulando relevância)
      break
  }
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
}

const downloadDocument = (document: any) => {
  documentsStore.incrementDownloadCount(document.id)
  console.log('Baixando documento:', document.title)
}

onMounted(() => {
  // Focar no campo de busca ao carregar a página
  document.querySelector('.search-input')?.focus()
})
</script>

<style scoped>
.search-input {
  border: 2px solid var(--border-color);
  font-size: 1.1rem;
  padding: 0.75rem 1rem;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.search-suggestions {
  position: relative;
  z-index: 1000;
}

.search-result-item {
  transition: all 0.2s ease;
}

.search-result-item:hover {
  box-shadow: var(--shadow-md);
}

.file-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
}

.search-snippet {
  background-color: var(--bg-light);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  border-left: 3px solid var(--primary-color);
}

.result-meta span {
  display: flex;
  align-items: center;
}

.tags .badge {
  font-size: 0.75rem;
}

.tip-item {
  padding: var(--spacing-sm);
  border-left: 3px solid var(--primary-color);
  background-color: var(--bg-light);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

@media (max-width: 768px) {
  .search-header .d-flex.gap-2 {
    flex-direction: column;
    width: 100%;
  }
  
  .result-meta {
    flex-direction: column;
    align-items: flex-start !important;
    gap: var(--spacing-xs) !important;
  }
  
  .actions .btn-group {
    width: 100%;
  }
  
  .actions .btn {
    flex: 1;
  }
}
</style>
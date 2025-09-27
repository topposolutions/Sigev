<template>
  <div class="analytics-page">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-semibold text-dark mb-1">Análises e Relatórios</h4>
        <p class="text-muted mb-0">Insights sobre o uso da plataforma</p>
      </div>
      <div class="d-flex gap-2">
        <select class="form-select" style="width: auto;" v-model="selectedPeriod">
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
        </select>
        <button class="btn btn-outline-primary">
          <Download :size="16" class="me-1" />
          Exportar
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="row mb-4">
      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card metric-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted mb-1">Total de Buscas</p>
                <h3 class="mb-0">{{ metrics.totalSearches }}</h3>
                <small class="text-success">
                  <TrendingUp :size="12" class="me-1" />
                  +12% vs período anterior
                </small>
              </div>
              <div class="metric-icon bg-primary">
                <Search :size="24" class="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card metric-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted mb-1">Downloads</p>
                <h3 class="mb-0">{{ metrics.totalDownloads }}</h3>
                <small class="text-success">
                  <TrendingUp :size="12" class="me-1" />
                  +8% vs período anterior
                </small>
              </div>
              <div class="metric-icon bg-success">
                <Download :size="24" class="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card metric-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted mb-1">Usuários Ativos</p>
                <h3 class="mb-0">{{ metrics.activeUsers }}</h3>
                <small class="text-warning">
                  <Minus :size="12" class="me-1" />
                  -2% vs período anterior
                </small>
              </div>
              <div class="metric-icon bg-info">
                <Users :size="24" class="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card metric-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted mb-1">Taxa de Sucesso</p>
                <h3 class="mb-0">{{ metrics.successRate }}%</h3>
                <small class="text-success">
                  <TrendingUp :size="12" class="me-1" />
                  +5% vs período anterior
                </small>
              </div>
              <div class="metric-icon bg-warning">
                <Target :size="24" class="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Most Searched Terms -->
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Termos Mais Buscados</h5>
          </div>
          <div class="card-body">
            <div class="search-terms">
              <div v-for="(term, index) in topSearchTerms" :key="term.id" class="search-term-item">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="d-flex align-items-center">
                    <span class="rank-badge">{{ index + 1 }}</span>
                    <div class="ms-3">
                      <div class="fw-semibold">{{ term.term }}</div>
                      <small class="text-muted">{{ term.searches }} buscas</small>
                    </div>
                  </div>
                  <div class="progress-container">
                    <div class="progress">
                      <div 
                        class="progress-bar bg-primary" 
                        :style="{ width: (term.searches / topSearchTerms[0].searches * 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Most Downloaded Documents -->
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Documentos Mais Baixados</h5>
          </div>
          <div class="card-body">
            <div class="popular-documents">
              <div v-for="(doc, index) in popularDocuments" :key="doc.id" class="document-item mb-3">
                <div class="d-flex align-items-center">
                  <span class="rank-badge">{{ index + 1 }}</span>
                  <div class="file-icon ms-3 me-3">
                    <component :is="getFileIcon(doc.type)" :size="20" :class="getFileTypeColor(doc.type)" />
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-semibold">{{ doc.title }}</div>
                    <small class="text-muted">{{ doc.downloadCount }} downloads</small>
                  </div>
                  <span class="badge bg-light text-dark">{{ doc.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Usage by Category -->
      <div class="col-lg-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Uso por Categoria</h5>
          </div>
          <div class="card-body">
            <div class="category-stats">
              <div v-for="category in categoryStats" :key="category.name" class="category-stat-item mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-semibold">{{ category.name }}</span>
                  <span class="text-muted">{{ category.percentage }}%</span>
                </div>
                <div class="progress">
                  <div 
                    class="progress-bar" 
                    :class="category.color"
                    :style="{ width: category.percentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="col-lg-8 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Atividade Recente</h5>
          </div>
          <div class="card-body">
            <div class="activity-timeline">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="d-flex">
                  <div class="activity-icon me-3">
                    <component :is="activity.icon" :size="16" :class="activity.color" />
                  </div>
                  <div class="flex-grow-1">
                    <div class="activity-text">{{ activity.text }}</div>
                    <div class="d-flex justify-content-between align-items-center">
                      <small class="text-muted">{{ activity.time }}</small>
                      <span class="badge bg-light text-dark">{{ activity.user }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row">
      <div class="col-lg-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">Horários de Maior Uso</h6>
          </div>
          <div class="card-body">
            <div class="usage-times">
              <div class="usage-time-item d-flex justify-content-between mb-2">
                <span>9h - 10h</span>
                <span class="fw-semibold">24%</span>
              </div>
              <div class="usage-time-item d-flex justify-content-between mb-2">
                <span>14h - 15h</span>
                <span class="fw-semibold">18%</span>
              </div>
              <div class="usage-time-item d-flex justify-content-between mb-2">
                <span>10h - 11h</span>
                <span class="fw-semibold">15%</span>
              </div>
              <div class="usage-time-item d-flex justify-content-between mb-2">
                <span>16h - 17h</span>
                <span class="fw-semibold">12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">Tipos de Arquivo Populares</h6>
          </div>
          <div class="card-body">
            <div class="file-types">
              <div class="file-type-item d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                  <FileText :size="16" class="text-danger me-2" />
                  <span>PDF</span>
                </div>
                <span class="fw-semibold">45%</span>
              </div>
              <div class="file-type-item d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                  <File :size="16" class="text-primary me-2" />
                  <span>DOCX</span>
                </div>
                <span class="fw-semibold">32%</span>
              </div>
              <div class="file-type-item d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                  <FileSpreadsheet :size="16" class="text-success me-2" />
                  <span>XLSX</span>
                </div>
                <span class="fw-semibold">18%</span>
              </div>
              <div class="file-type-item d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                  <FileText :size="16" class="text-secondary me-2" />
                  <span>TXT</span>
                </div>
                <span class="fw-semibold">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0">Departamentos Mais Ativos</h6>
          </div>
          <div class="card-body">
            <div class="departments">
              <div class="department-item d-flex justify-content-between mb-2">
                <span>TI</span>
                <span class="fw-semibold">156 acessos</span>
              </div>
              <div class="department-item d-flex justify-content-between mb-2">
                <span>Operações</span>
                <span class="fw-semibold">132 acessos</span>
              </div>
              <div class="department-item d-flex justify-content-between mb-2">
                <span>Financeiro</span>
                <span class="fw-semibold">98 acessos</span>
              </div>
              <div class="department-item d-flex justify-content-between mb-2">
                <span>RH</span>
                <span class="fw-semibold">76 acessos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Download, 
  Search, 
  Users, 
  TrendingUp, 
  Target, 
  Minus,
  FileText,
  File,
  FileSpreadsheet,
  Eye,
  Upload,
  Edit,
  CheckCircle,
  AlertCircle
} from 'lucide-vue-next'

const selectedPeriod = ref('30')

const metrics = ref({
  totalSearches: 1247,
  totalDownloads: 856,
  activeUsers: 142,
  successRate: 94
})

const topSearchTerms = ref([
  { id: 1, term: 'manual de procedimentos', searches: 89 },
  { id: 2, term: 'política de segurança', searches: 76 },
  { id: 3, term: 'relatório anual', searches: 64 },
  { id: 4, term: 'organograma', searches: 52 },
  { id: 5, term: 'processo de compras', searches: 41 }
])

const popularDocuments = ref([
  { id: 1, title: 'Manual de Procedimentos Operacionais', type: 'PDF', category: 'Operações', downloadCount: 45 },
  { id: 2, title: 'Relatório Anual 2023', type: 'PDF', category: 'Financeiro', downloadCount: 38 },
  { id: 3, title: 'Política de Segurança da Informação', type: 'DOCX', category: 'TI', downloadCount: 32 },
  { id: 4, title: 'Organograma Corporativo', type: 'PDF', category: 'RH', downloadCount: 28 },
  { id: 5, title: 'Processo de Compras', type: 'DOCX', category: 'Financeiro', downloadCount: 24 }
])

const categoryStats = ref([
  { name: 'TI', percentage: 35, color: 'bg-primary' },
  { name: 'Operações', percentage: 28, color: 'bg-success' },
  { name: 'Financeiro', percentage: 22, color: 'bg-warning' },
  { name: 'RH', percentage: 15, color: 'bg-info' }
])

const recentActivities = ref([
  {
    id: 1,
    text: 'Buscou por "manual de procedimentos"',
    time: '2 min atrás',
    user: 'João Silva',
    icon: Search,
    color: 'text-primary'
  },
  {
    id: 2,
    text: 'Baixou "Relatório Anual 2023"',
    time: '5 min atrás',
    user: 'Maria Santos',
    icon: Download,
    color: 'text-success'
  },
  {
    id: 3,
    text: 'Visualizou "Política de Segurança"',
    time: '8 min atrás',
    user: 'Pedro Costa',
    icon: Eye,
    color: 'text-info'
  },
  {
    id: 4,
    text: 'Fez upload de novo documento',
    time: '12 min atrás',
    user: 'Ana Lima',
    icon: Upload,
    color: 'text-warning'
  },
  {
    id: 5,
    text: 'Editou "Manual de Procedimentos"',
    time: '15 min atrás',
    user: 'Carlos Oliveira',
    icon: Edit,
    color: 'text-secondary'
  }
])

const getFileIcon = (type: string) => {
  const icons: Record<string, any> = {
    'PDF': FileText,
    'DOCX': File,
    'TXT': FileText,
    'XLSX': FileSpreadsheet
  }
  return icons[type] || FileText
}

const getFileTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'PDF': 'text-danger',
    'DOCX': 'text-primary',
    'TXT': 'text-secondary',
    'XLSX': 'text-success'
  }
  return colors[type] || 'text-secondary'
}

onMounted(() => {
  // Carregar dados de analytics
})
</script>

<style scoped>
.metric-card {
  border: none;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.metric-card:hover {
  box-shadow: var(--shadow-md);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-badge {
  width: 24px;
  height: 24px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  flex-shrink: 0;
}

.progress-container {
  width: 100px;
}

.progress {
  height: 4px;
}

.search-term-item,
.document-item {
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease;
}

.search-term-item:hover,
.document-item:hover {
  background-color: var(--bg-light);
}

.file-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
}

.activity-timeline {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-light);
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-text {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: var(--spacing-xs);
}

.category-stat-item {
  padding: var(--spacing-xs) 0;
}

.usage-time-item,
.file-type-item,
.department-item {
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.usage-time-item:last-child,
.file-type-item:last-child,
.department-item:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .d-flex.gap-2 {
    flex-direction: column;
    gap: var(--spacing-sm) !important;
  }
  
  .form-select {
    width: 100% !important;
  }
  
  .metric-card .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
    gap: var(--spacing-sm);
  }
  
  .metric-icon {
    align-self: flex-end;
  }
}
</style>
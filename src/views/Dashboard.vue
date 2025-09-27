<template>
  <div class="dashboard">
    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card stats-card h-100">
          <div class="card-body d-flex align-items-center">
            <div class="stats-icon me-3">
              <FileText :size="32" />
            </div>
            <div>
              <div class="h3 mb-0 fw-bold">{{ documentsStore.totalDocuments }}</div>
              <div class="small opacity-75">Total de Documentos</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card stats-card h-100">
          <div class="card-body d-flex align-items-center">
            <div class="stats-icon me-3">
              <Download :size="32" />
            </div>
            <div>
              <div class="h3 mb-0 fw-bold">{{ documentsStore.totalDownloads }}</div>
              <div class="small opacity-75">Total de Downloads</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card stats-card h-100">
          <div class="card-body d-flex align-items-center">
            <div class="stats-icon me-3">
              <Users :size="32" />
            </div>
            <div>
              <div class="h3 mb-0 fw-bold">{{ activeUsers }}</div>
              <div class="small opacity-75">Usuários Ativos</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-3 col-md-6 mb-3">
        <div class="card stats-card h-100">
          <div class="card-body d-flex align-items-center">
            <div class="stats-icon me-3">
              <TrendingUp :size="32" />
            </div>
            <div>
              <div class="h3 mb-0 fw-bold">+{{ growthPercentage }}%</div>
              <div class="small opacity-75">Crescimento Mensal</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Recent Documents -->
      <div class="col-lg-8 mb-4">
        <div class="card">
          <div class="card-header bg-white">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0 fw-semibold">Documentos Recentes</h5>
              <router-link to="/documents" class="btn btn-sm btn-outline-primary">
                Ver Todos
              </router-link>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Documento</th>
                    <th>Categoria</th>
                    <th>Tamanho</th>
                    <th>Data</th>
                    <th>Downloads</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="doc in documentsStore.recentDocuments" :key="doc.id" class="document-item">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="file-icon me-2">
                          <FileText :size="20" :class="getFileTypeColor(doc.type)" />
                        </div>
                        <div>
                          <div class="fw-semibold">{{ doc.title }}</div>
                          <small class="text-muted">{{ doc.type }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge bg-light text-dark">{{ doc.category }}</span>
                    </td>
                    <td>{{ formatFileSize(doc.size) }}</td>
                    <td>{{ formatDate(doc.uploadDate) }}</td>
                    <td>
                      <span class="badge bg-primary">{{ doc.downloadCount }}</span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary" @click="viewDocument(doc)">
                          <Eye :size="14" />
                        </button>
                        <button class="btn btn-outline-secondary" @click="downloadDocument(doc)">
                          <Download :size="14" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Activity -->
      <div class="col-lg-4 mb-4">
        <div class="card mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0 fw-semibold">Ações Rápidas</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/upload" class="btn btn-primary">
                <Upload :size="16" class="me-2" />
                Fazer Upload
              </router-link>
              <router-link to="/search" class="btn btn-outline-primary">
                <Search :size="16" class="me-2" />
                Buscar Documentos
              </router-link>
              <router-link to="/analytics" class="btn btn-outline-secondary">
                <BarChart3 :size="16" class="me-2" />
                Ver Relatórios
              </router-link>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header bg-white">
            <h5 class="mb-0 fw-semibold">Atividade Recente</h5>
          </div>
          <div class="card-body">
            <div class="activity-timeline">
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                <div class="d-flex">
                  <div class="activity-icon me-3">
                    <component :is="activity.icon" :size="16" :class="activity.color" />
                  </div>
                  <div class="flex-grow-1">
                    <div class="activity-text">{{ activity.text }}</div>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { 
  FileText, 
  Download, 
  Users, 
  TrendingUp, 
  Upload, 
  Search, 
  BarChart3, 
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-vue-next'
import { useDocumentsStore } from '../stores/documents'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default {
  name: 'Dashboard',

  data() {
    return {
      activeUsers: 24,
      growthPercentage: 12,
      recentActivity: [
        {
          id: 1,
          text: 'Manual de Procedimentos foi atualizado',
          time: '2 horas atrás',
          icon: CheckCircle,
          color: 'text-success'
        },
        {
          id: 2,
          text: 'Relatório Anual 2023 foi baixado 3 vezes',
          time: '4 horas atrás',
          icon: Download,
          color: 'text-primary'
        },
        {
          id: 3,
          text: 'Novo documento adicionado à categoria TI',
          time: '6 horas atrás',
          icon: Upload,
          color: 'text-info'
        },
        {
          id: 4,
          text: 'Política de Segurança precisa de revisão',
          time: '1 dia atrás',
          icon: AlertCircle,
          color: 'text-warning'
        }
      ]
    }
  },

  created() {
    this.documentsStore = useDocumentsStore()
  },

  mounted() {
    // Carregar dados do dashboard
  },

  methods: {
    getFileTypeColor(type) {
      const colors = {
        'PDF': 'text-danger',
        'DOCX': 'text-primary',
        'TXT': 'text-secondary',
        'XLSX': 'text-success'
      }
      return colors[type] || 'text-secondary'
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    formatDate(date) {
      return format(date, 'dd MMM yyyy', { locale: ptBR })
    },

    viewDocument(doc) {
      console.log('Visualizando documento:', doc.title)
    },

    downloadDocument(doc) {
      this.documentsStore.incrementDownloadCount(doc.id)
      console.log('Baixando documento:', doc.title)
    }
  }
}
</script>


<style scoped>
.stats-card {
  background: linear-gradient(135deg, var(--primary-color) 0%, #0a58ca 100%);
  color: white;
  border: none;
}

.stats-icon {
  opacity: 0.8;
}

.document-item:hover {
  background-color: rgba(13, 110, 253, 0.02);
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
  position: relative;
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
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-group-sm .btn {
    padding: 0.25rem 0.4rem;
  }
}
</style>
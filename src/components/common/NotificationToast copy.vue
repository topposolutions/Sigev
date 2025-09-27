<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1060;">
    <!-- Indicador de status da conexão WebSocket -->
    <div v-if="connectionStatus.error" class="alert alert-warning alert-sm mb-2">
      <i class="bi bi-wifi-off me-2"></i>
      {{ connectionStatus.error }}
    </div>
    
    <div 
      v-for="notification in allNotifications" 
      :key="notification.id"
      class="toast show"
      :class="{
        'toast-unread': !notification.read,
        'toast-high-priority': notification.priority === 'high',
        'toast-critical': notification.priority === 'critical'
      }"
      role="alert"
    >
    
      <div class="toast-header">
        <component 
          :is="notification.icon" 
          :size="16" 
          :class="notification.color" 
          class="me-2"
        />
        <strong class="me-auto">{{ notification.title }}</strong>
        <small class="text-muted">{{ notification.time }}</small>
        <div class="toast-actions">
          <button 
            v-if="!notification.read"
            type="button" 
            class="btn btn-sm btn-link text-primary p-0 me-2"
            @click="markNotificationAsRead(notification.id)"
            title="Marcar como lida"
          >
            <i class="bi bi-check2"></i>
          </button>
          <button 
            type="button" 
            class="btn-close" 
            @click="removeNotification(notification.id)"
            title="Fechar"
          ></button>
        </div>
      </div>
      <div class="toast-body">
        <div class="notification-message" v-html="notification.message"></div>
        <div v-if="notification.category && notification.category !== 'general'" class="notification-category">
          <small class="text-muted">{{ notification.category }}</small>
        </div>
        <!-- Informações adicionais para notificações de documento -->
        <div v-if="notification.data && notification.data.nome_documento" class="notification-document-info">
          <small class="text-muted">
            <i class="bi bi-file-text me-1"></i>
            {{ notification.data.nome_documento }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup ">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle,
  Bell,
  FileText,
  AlertTriangle,
  CheckCircle2
} from 'lucide-vue-next'
//@ts-ignore
import { useNotifications } from '../../composables/useNotifications'


const notifications = ref([])
const teste = ref([
  {
  "id": 1753450994107,
  "title": "Lembrete de data em documento",
  "message": "<strong>Documento:</strong> Processo_Trabalhista_Pedro_Henrique_Costa.pdf<br><strong>Evento:</strong> Oitiva de testemunhas e apresentação de provas periciais complementares relacionadas à jornada de trabalho e alegadas horas extras.<br><strong>Observações:</strong> Teste 1 Lembrete Bispo",
  "type": "document",
  "color": "text-primary",
  "time": "agora",
  "read": false,
  "priority": "high",
  "category": "document",
  "data": {
    "nome_documento": "Processo_Trabalhista_Pedro_Henrique_Costa.pdf",
    "descricao_evento": "Oitiva de testemunhas e apresentação de provas periciais complementares relacionadas à jornada de trabalho e alegadas horas extras.",
    "observacoes": "Teste 1 Lembrete Bispo"
  }}
])
// Usar o composable de notificações
const {
  notifications: wsNotifications,
  unreadCount,
  connectionStatus,
  markAsRead,
  removeNotification: removeWsNotification
} = useNotifications({
  autoConnect: true,
  autoCleanup: true,
  maxNotifications: 50
})

// Computed para notificações do WebSocket
const wsNotificationsList = computed(() => {
  return wsNotifications.value.map(wsNotif => ({
    id: wsNotif.id,
    title: wsNotif.title,
    message: wsNotif.message,
    type: wsNotif.type,
    icon: getIconForType(wsNotif.type),
    color: getColorForType(wsNotif.type),
    time: formatTime(wsNotif.timestamp),
    read: wsNotif.read,
    priority: wsNotif.priority,
    category: wsNotif.category,
    data: wsNotif.data
  }))
})

// Função para obter ícone baseado no tipo
const getIconForType = (type) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    upload: FileText,
    processing: CheckCircle2,
    document: FileText
  }
  return icons[type] || Info
}

// Função para obter cor baseada no tipo
const getColorForType = (type) => {
  const colors = {
    success: 'text-success',
    error: 'text-danger',
    warning: 'text-warning',
    info: 'text-info',
    upload: 'text-primary',
    processing: 'text-info',
    document: 'text-primary'
  }
  return colors[type] || 'text-info'
}

// Função para formatar tempo
const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now - time
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `${diffMins} min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 7) return `${diffDays} dias atrás`
  return time.toLocaleDateString('pt-BR')
}

// Função para adicionar notificação manual (para compatibilidade)
const addNotification = (notification) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }
  
  const colors = {
    success: 'text-success',
    error: 'text-danger',
    warning: 'text-warning',
    info: 'text-info'
  }
  
  const newNotification = {
    ...notification,
    id: Date.now(),
    icon: icons[notification.type],
    color: colors[notification.type],
    time: 'agora',
    read: false,
    priority: 'normal',
    category: 'manual'
  }
  
  notifications.value.push(newNotification)
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(newNotification.id)
  }, 5000)
}

// Função para remover notificação
const removeNotification = (id) => {
  // Remover do array local
  const localIndex = notifications.value.findIndex(n => n.id === id)
  if (localIndex !== -1) {
    notifications.value.splice(localIndex, 1)
  }
  
  // Remover do WebSocket store
  removeWsNotification(id)
}

// Função para marcar como lida
const markNotificationAsRead = (id) => {
  markAsRead(id)
}

// Computed para todas as notificações (locais + WebSocket)
const allNotifications = computed(() => {
  return [...notifications.value, ...wsNotificationsList.value]
    .sort((a, b) => {
      // Priorizar não lidas
      if (a.read !== b.read) return a.read ? 1 : -1
      // Depois por prioridade
      const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
})

// Expose methods for global use
defineExpose({
  addNotification,
  removeNotification,
  markNotificationAsRead
})

onMounted(() => {
  // Example notifications for demo (apenas se não houver notificações do WebSocket)
  setTimeout(() => {
    if (wsNotifications.value.length === 0) {
      addNotification({
        title: 'Bem-vindo!',
        message: 'Sistema carregado com sucesso.',
        type: 'success'
      })
    }
  }, 1000)
})
</script>

<style scoped>
.toast {
  min-width: 300px;
  margin-bottom: var(--spacing-sm);
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.toast-container {
  max-width: 400px;
}

.toast-unread {
  border-left-color: var(--bs-primary);
  background-color: rgba(var(--bs-primary-rgb), 0.05);
}

.toast-high-priority {
  border-left-color: var(--bs-warning);
  background-color: rgba(var(--bs-warning-rgb), 0.05);
}

.toast-critical {
  border-left-color: var(--bs-danger);
  background-color: rgba(var(--bs-danger-rgb), 0.05);
  animation: pulse 2s infinite;
}

.toast-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.notification-message {
  word-break: break-word;
}

.notification-category {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.notification-document-info {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.notification-message strong {
  color: #495057;
  font-weight: 600;
}

.alert-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--bs-danger-rgb), 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--bs-danger-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--bs-danger-rgb), 0);
  }
}

@media (max-width: 768px) {
  .toast-container {
    left: var(--spacing-md);
    right: var(--spacing-md);
    max-width: none;
  }
  
  .toast {
    min-width: auto;
    width: 100%;
  }
}
</style>
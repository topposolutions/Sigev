<template>
  <div class="toast-container">
    <!-- Indicador de status da conexão WebSocket -->
    <div v-if="connectionStatus.error" class="connection-error-alert">
      <div class="connection-error-content">
        <i class="bi bi-wifi-off"></i>
        <span>{{ connectionStatus.error }}</span>
      </div>
    </div>
    
    <!-- Notificações do WebSocket (Layout Moderno) -->
    <div 
      v-for="notification in sortedWsNotifications" 
      :key="notification.id"
      class="notification-toast"
      :class="{
        'notification-unread': !notification.read,
        'notification-high-priority': notification.priority === 'high',
        'notification-critical': notification.priority === 'critical',
        [`notification-type-${notification.type}`]: true
      }"
      role="alert"
    >
      <!-- Barra lateral colorida -->
      <div class="notification-accent" :class="`accent-${notification.type}`"></div>
      
      <!-- Conteúdo principal -->
      <div class="notification-content">
        <!-- Header -->
        <div class="notification-header">
          <div class="notification-icon-wrapper" :class="`icon-${notification.type}`">
            <component 
              :is="notification.icon" 
              :size="18" 
              class="notification-icon"
            />
          </div>
          
          <div class="notification-title-section">
            <h6 class="notification-title">{{ notification.title }}</h6>
            <span class="notification-time">{{ notification.time }}</span>
          </div>
          
          <div class="notification-actions">
            <button 
              v-if="!notification.read"
              type="button" 
              class="action-btn mark-read-btn"
              @click.stop="markNotificationAsRead(notification.id)"
              @mousedown.stop
              @mouseup.stop
              title="Marcar como lida"
            >
              <i class="bi bi-check2"></i>
            </button>
            <button 
              type="button" 
              class="action-btn close-btn"
              @click.stop="removeNotification(notification.id)"
              title="Fechar"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
        
        <!-- Body -->
        <div class="notification-body">
          <div class="notification-message" v-html="notification.message"></div>
          
          <!-- Categoria -->
          <div v-if="notification.category && notification.category !== 'general'" class="notification-category">
            <span class="category-badge" :class="`category-${notification.category}`">
              {{ notification.category }}
            </span>
          </div>
          
          <!-- Informações do documento -->
          <div v-if="notification.data && notification.data.nome_documento" class="notification-document-info">
            <div class="document-info-content">
              <i class="bi bi-file-text"></i>
              <span class="document-name">{{ notification.data.nome_documento }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notificações Manuais (Layout Simples) -->
    <div 
      v-for="notification in notifications" 
      :key="notification.id"
      class="toast show simple-toast"
      role="alert"
      @click="testClick('container', notification.id)"
    >
      <div class="toast-header">
        <component 
          :is="notification.icon" 
          :size="16" 
          class="simple-toast-icon me-2"
        />
        <strong class="me-auto">{{ notification.title }}</strong>
        <small style="color: #fff;" class="text-muted">{{ notification.time }}</small>
        <button 
          type="button" 
          class="btn-close btn-close-white" 
          @click.stop="removeNotification(notification.id)"
          title="Fechar"
        ></button>
      </div>
      <div class="toast-body">
        {{ notification.message }}
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

// Função para obter cor baseada no tipo (mantida para compatibilidade)
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
    id: Date.now() + Math.random(), // ID único
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
  // Remover do array local (notificações manuais)
  const localIndex = notifications.value.findIndex(n => n.id === id)
  if (localIndex !== -1) {
    notifications.value.splice(localIndex, 1)
    return
  }
  
  // Remover do WebSocket store
  removeWsNotification(id)
}

// Função de teste para verificar se os cliques estão funcionando
const testClick = (action, id) => {
  console.log(`Teste de clique: ${action} para ID ${id}`)
}

// Função para marcar como lida
const markNotificationAsRead = (id) => {
  
  // Verificar se é notificação manual (local)
  const localNotification = notifications.value.find(n => n.id === id)
  if (localNotification) {
    localNotification.read = true
    return
  }
  
  // Marcar no WebSocket store
  markAsRead(id)
  console.log(`Notificação WebSocket marcada como lida: ${id}`);
}

// Computed para ordenar notificações do WebSocket por prioridade
const sortedWsNotifications = computed(() => {
  return wsNotificationsList.value.sort((a, b) => {
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
/* Container principal */
.toast-container {
  max-width: 420px;
  z-index: 9999;
  pointer-events: auto;
  position: fixed;
  top: 0;
  right: 0;
  padding: 1rem;
}

/* Alerta de erro de conexão */
.connection-error-alert {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  animation: slideInDown 0.3s ease-out;
}

.connection-error-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.connection-error-content i {
  font-size: 1rem;
}

/* Notificação principal */
.notification-toast {
  background: white;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  min-width: 320px;
  max-width: 420px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInRight 0.4s ease-out;
  pointer-events: auto;
  z-index: 1061;
}

.notification-toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Barra lateral colorida */
.notification-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #6c757d, #495057);
}

.accent-success {
  background: linear-gradient(to bottom, #28a745, #20c997);
}

.accent-error {
  background: linear-gradient(to bottom, #dc3545, #e74c3c);
}

.accent-warning {
  background: linear-gradient(to bottom, #ffc107, #fd7e14);
}

.accent-info {
  background: linear-gradient(to bottom, #17a2b8, #3498db);
}

.accent-upload {
  background: linear-gradient(to bottom, #007bff, #6f42c1);
}

.accent-processing {
  background: linear-gradient(to bottom, #17a2b8, #20c997);
}

.accent-document {
  background: linear-gradient(to bottom, #6f42c1, #e83e8c);
}

/* Conteúdo da notificação */
.notification-content {
  padding: 16px;
  margin-left: 4px;
  pointer-events: auto;
  position: relative;
  z-index: 1061;
}

/* Header da notificação */
.notification-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

/* Wrapper do ícone */
.notification-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.icon-success {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border-color: rgba(40, 167, 69, 0.2);
}

.icon-error {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  border-color: rgba(220, 53, 69, 0.2);
}

.icon-warning {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border-color: rgba(255, 193, 7, 0.2);
}

.icon-info {
  background: linear-gradient(135deg, #d1ecf1, #bee5eb);
  border-color: rgba(23, 162, 184, 0.2);
}

.icon-upload {
  background: linear-gradient(135deg, #cce7ff, #b3d9ff);
  border-color: rgba(0, 123, 255, 0.2);
}

.icon-processing {
  background: linear-gradient(135deg, #d1ecf1, #bee5eb);
  border-color: rgba(23, 162, 184, 0.2);
}

.icon-document {
  background: linear-gradient(135deg, #e2d9f3, #d4c5f1);
  border-color: rgba(111, 66, 193, 0.2);
}

.notification-icon {
  color: #495057;
}

.icon-success .notification-icon {
  color: #155724;
}

.icon-error .notification-icon {
  color: #721c24;
}

.icon-warning .notification-icon {
  color: #856404;
}

.icon-info .notification-icon {
  color: #0c5460;
}

.icon-upload .notification-icon {
  color: #004085;
}

.icon-processing .notification-icon {
  color: #0c5460;
}

.icon-document .notification-icon {
  color: #4a148c;
}

/* Seção do título */
.notification-title-section {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #a9acae;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.notification-time {
  font-size: 0.75rem;
  color: #e1e3e5;
  font-weight: 500;
}

/* Ações */
.notification-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6c757d;
  position: relative;
  z-index: 1062;
  pointer-events: auto;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #495057;
}

.mark-read-btn:hover {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.close-btn:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.action-btn i {
  font-size: 0.875rem;
  pointer-events: none;
}

/* Garantir que os botões sejam clicáveis */
.mark-read-btn,
.close-btn {
  pointer-events: auto !important;
  z-index: 1063 !important;
  position: relative;
}

/* Body da notificação */
.notification-body {
  margin-left: 52px;
}

.notification-message {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #495057;
  margin-bottom: 12px;
  word-break: break-word;
}

.notification-message strong {
  color: #212529;
  font-weight: 600;
}

/* Categoria */
.notification-category {
  margin-bottom: 8px;
}

.category-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-document {
  background: linear-gradient(135deg, #e2d9f3, #d4c5f1);
  color: #4a148c;
}

.category-system {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #495057;
}

.category-user {
  background: linear-gradient(135deg, #d1ecf1, #bee5eb);
  color: #0c5460;
}

.category-processing {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  color: #856404;
}

.category-general {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #6c757d;
}

/* Informações do documento */
.notification-document-info {
  margin-top: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.document-info-content {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #495057;
  min-width: 0; /* Permite que o flex item filho seja menor que o conteúdo */
}

.document-info-content i {
  color: #6f42c1;
  font-size: 0.875rem;
}

.document-name {
  font-weight: 500;
  color: #495057;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* Estados especiais */
.notification-unread {
  border-left: 4px solid #007bff;
  background: linear-gradient(135deg, #ffffff, #f8f9ff);
}

.notification-high-priority {
  border-left: 4px solid #ffc107;
  background: linear-gradient(135deg, #ffffff, #fffbf0);
}

.notification-critical {
  border-left: 4px solid #dc3545;
  background: linear-gradient(135deg, #ffffff, #fff5f5);
  animation: criticalPulse 2s infinite;
}

/* Animações */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes criticalPulse {
  0% {
    box-shadow: 0 8px 32px rgba(220, 53, 69, 0.12);
  }
  50% {
    box-shadow: 0 8px 32px rgba(220, 53, 69, 0.25);
  }
  100% {
    box-shadow: 0 8px 32px rgba(220, 53, 69, 0.12);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .toast-container {
    left: 12px;
    right: 12px;
    max-width: none;
  }
  
  .notification-toast {
    min-width: auto;
    width: 100%;
    max-width: none;
  }
  
  .notification-content {
    padding: 12px;
  }
  
  .notification-header {
    gap: 8px;
  }
  
  .notification-icon-wrapper {
    width: 36px;
    height: 36px;
  }
  
  .notification-body {
    margin-left: 44px;
  }
  
  .document-name {
    max-width: 150px; /* Menor em mobile */
  }
}

/* Layout Simples para Notificações Manuais (como na imagem) */
.simple-toast {
  min-width: 300px;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #2d3748, #4a5568);
  animation: slideInRight 0.3s ease-out;
}

.simple-toast .toast-header {
  padding: 12px 16px 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  display: flex;
  align-items: center;
  gap: 8px;
}

.simple-toast .toast-header strong {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  flex: 1;
}

.simple-toast .toast-header small {
  font-size: 0.75rem;
  color: #eeeded !important;
  margin-right: 8px;
}

.simple-toast .toast-header .btn-close {
  padding: 0;
  width: 16px;
  height: 16px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  position: relative;
  z-index: 10;
}

.simple-toast .toast-header .btn-close:hover {
  opacity: 1;
}

.simple-toast-icon {
  color: white;
}

.simple-toast .toast-body {
  padding: 8px 16px 12px 16px;
  font-size: 0.875rem;
  line-height: 1.4;
  color: white;
  background: transparent;
}

/* Responsividade para layout simples */
@media (max-width: 768px) {
  .simple-toast {
    min-width: auto;
    width: 100%;
    margin-bottom: 6px;
  }
  
  .simple-toast .toast-header {
    padding: 10px 12px 6px 12px;
  }
  
  .simple-toast .toast-body {
    padding: 6px 12px 10px 12px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .notification-toast {
    background: #2d3748;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .notification-title {
    color: #e2e8f0;
  }
  
  .notification-message {
    color: #a0aec0;
  }
  
  .notification-time {
    color: #718096;
  }
  
  .action-btn {
    color: #a0aec0;
  }
  
  .action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
  }
  
  /* Dark mode para layout simples */
  .simple-toast {
    background: #2d3748;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .simple-toast .toast-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .simple-toast .toast-header strong {
    color: #e2e8f0;
  }
  
  .simple-toast .toast-header small {
    color: #a0aec0;
  }
  
  .simple-toast .toast-body {
    color: #a0aec0;
  }
}
</style>
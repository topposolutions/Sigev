import { computed, onMounted, onUnmounted } from 'vue';
import { useNotificationsStore } from '../stores/notifications.store';

/**
 * Composable para gerenciar notificações WebSocket
 * @param {Object} options - Opções de configuração
 * @returns {Object} Métodos e dados para gerenciar notificações
 */
export function useNotifications(options = {}) {
  const store = useNotificationsStore();
  
  // Configurações padrão
  const config = {
    autoConnect: true,
    autoCleanup: true,
    maxNotifications: 100,
    ...options
  };

  // Computed properties
  const notifications = computed(() => store.getAllNotifications);
  const unreadCount = computed(() => store.getUnreadCount);
  const unreadNotifications = computed(() => store.getUnreadNotifications);
  const recentNotifications = computed(() => store.getRecentNotifications);
  const connectionStatus = computed(() => store.getConnectionStatus);

  // Métodos
  const connect = () => {
    store.initializeWebSocket();
  };

  const disconnect = () => {
    store.disconnectWebSocket();
  };

  const reconnect = () => {
    store.reconnect();
  };

  const markAsRead = (notificationId) => {
    store.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    store.markAllAsRead();
  };

  const removeNotification = (notificationId) => {
    store.removeNotification(notificationId);
  };

  const clearAll = () => {
    store.clearAllNotifications();
  };

  const getByType = (type) => {
    return store.getNotificationsByType(type);
  };

  const getByCategory = (category) => {
    return store.getNotificationsByCategory(category);
  };

  const getByPriority = (priority) => {
    return store.getNotificationsByPriority(priority);
  };

  const getStats = () => {
    return store.getNotificationStats();
  };

  const setMaxNotifications = (max) => {
    store.setMaxNotifications(max);
  };

  // Configurar limite máximo se fornecido
  if (config.maxNotifications) {
    setMaxNotifications(config.maxNotifications);
  }

  // Lifecycle hooks
  onMounted(() => {
    if (config.autoConnect) {
      connect();
    }
  });

  onUnmounted(() => {
    if (config.autoCleanup) {
      disconnect();
    }
  });

  return {
    // Estado reativo
    notifications,
    unreadCount,
    unreadNotifications,
    recentNotifications,
    connectionStatus,
    
    // Métodos
    connect,
    disconnect,
    reconnect,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getByType,
    getByCategory,
    getByPriority,
    getStats,
    setMaxNotifications,
    
    // Store direto (para casos avançados)
    store,
  };
}

/**
 * Composable específico para notificações em tempo real
 * @param {Object} options - Opções de configuração
 * @returns {Object} Métodos e dados para notificações em tempo real
 */
export function useRealtimeNotifications(options = {}) {
  const {
    notifications,
    unreadCount,
    connectionStatus,
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
  } = useNotifications(options);

  // Computed para notificações de alta prioridade
  const highPriorityNotifications = computed(() => 
    notifications.value.filter(n => n.priority === 'high' && !n.read)
  );

  // Computed para notificações críticas
  const criticalNotifications = computed(() => 
    notifications.value.filter(n => n.priority === 'critical' && !n.read)
  );

  // Computed para notificações do sistema
  const systemNotifications = computed(() => 
    notifications.value.filter(n => n.category === 'system')
  );

  // Computed para notificações de documentos
  const documentNotifications = computed(() => 
    notifications.value.filter(n => n.category === 'document')
  );

  return {
    // Estado reativo
    notifications,
    unreadCount,
    connectionStatus,
    highPriorityNotifications,
    criticalNotifications,
    systemNotifications,
    documentNotifications,
    
    // Métodos
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
  };
}

/**
 * Composable para notificações específicas de documentos
 * @returns {Object} Métodos e dados para notificações de documentos
 */
export function useDocumentNotifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications({ autoConnect: true });

  // Computed para notificações de documentos
  const documentNotifications = computed(() => 
    notifications.value.filter(n => n.category === 'document' || n.type === 'document')
  );

  // Computed para lembretes de documento (formato específico do backend)
  const documentReminders = computed(() => 
    notifications.value.filter(n => 
      n.category === 'document' && 
      n.data && 
      n.data.nome_documento
    )
  );

  // Computed para notificações de upload
  const uploadNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'upload')
  );

  // Computed para notificações de processamento
  const processingNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'processing')
  );

  // Computed para notificações de erro
  const errorNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'error')
  );

  // Método para marcar notificações de documento como lidas
  const markDocumentNotificationsAsRead = () => {
    documentNotifications.value.forEach(notification => {
      markAsRead(notification.id);
    });
  };

  // Método para remover notificações de documento antigas
  const clearOldDocumentNotifications = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    documentNotifications.value.forEach(notification => {
      if (new Date(notification.timestamp) < thirtyDaysAgo) {
        removeNotification(notification.id);
      }
    });
  };

  return {
    // Estado reativo
    notifications,
    unreadCount,
    documentNotifications,
    documentReminders,
    uploadNotifications,
    processingNotifications,
    errorNotifications,
    
    // Métodos
    markAsRead,
    markAllAsRead,
    removeNotification,
    markDocumentNotificationsAsRead,
    clearOldDocumentNotifications,
  };
} 
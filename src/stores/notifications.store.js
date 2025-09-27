import { defineStore } from 'pinia';
import webSocketService from '../common/services/websocket.service';
import JwtService from '../common/services/jwt.service';
import { getWebSocketUrl, getCurrentConfig } from '../common/config/websocket.config';

export const useNotificationsStore = defineStore('notifications', {
  state: () => {
    const config = getCurrentConfig();
    return {
      notifications: [],
      unreadCount: 0,
      isConnected: false,
      connectionError: null,
      maxNotifications: config.NOTIFICATIONS.maxInMemory,
      config: config,
    };
  },

  getters: {
    /**
     * Obtém todas as notificações
     */
    getAllNotifications: (state) => state.notifications,

    /**
     * Obtém notificações não lidas
     */
    getUnreadNotifications: (state) => state.notifications.filter(n => !n.read),

    /**
     * Obtém contagem de notificações não lidas
     */
    getUnreadCount: (state) => state.unreadCount,

    /**
     * Obtém status da conexão WebSocket
     */
    getConnectionStatus: (state) => ({
      isConnected: state.isConnected,
      error: state.connectionError
    }),

    /**
     * Obtém notificações por tipo
     */
    getNotificationsByType: (state) => (type) => {
      return state.notifications.filter(n => n.type === type);
    },

    /**
     * Obtém notificações recentes (últimas 10)
     */
    getRecentNotifications: (state) => {
      return state.notifications
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    },
  },

  actions: {
    /**
     * Inicializa a conexão WebSocket
     */
    initializeWebSocket() {
      const token = JwtService.getToken();
      if (!token) {
        console.error('Token não encontrado para conexão WebSocket');
        this.connectionError = 'Token de autenticação não encontrado';
        return;
      }

      try {
        const wsUrl = getWebSocketUrl(token);

        // Configurar opções de reconexão
        webSocketService.setReconnectionOptions({
          maxAttempts: this.config.RECONNECTION.maxAttempts,
          delay: this.config.RECONNECTION.initialDelay,
          maxDelay: this.config.RECONNECTION.maxDelay,
        });

        // Configurar listeners do WebSocket
        webSocketService.on('connected', this.handleConnected);
        webSocketService.on('disconnected', this.handleDisconnected);
        webSocketService.on('error', this.handleError);
        webSocketService.on('notification', this.handleNotification);
        webSocketService.on('message', this.handleMessage);

        // Conectar ao WebSocket
        webSocketService.connect(wsUrl);
      } catch (error) {
        console.error('Erro ao inicializar WebSocket:', error);
        this.connectionError = error.message;
      }
    },

    /**
     * Desconecta o WebSocket
     */
    disconnectWebSocket() {
      webSocketService.disconnect();
      webSocketService.clearListeners();
      this.isConnected = false;
      this.connectionError = null;
    },

    /**
     * Handler para conexão estabelecida
     */
    handleConnected() {
      this.isConnected = true;
      this.connectionError = null;
      console.log('WebSocket conectado - Notificações ativas');
    },

    /**
     * Handler para desconexão
     */
    handleDisconnected(event) {
      this.isConnected = false;
      console.log('WebSocket desconectado:', event);
    },

    /**
     * Handler para erros de conexão
     */
    handleError(error) {
      this.connectionError = error.message || 'Erro na conexão WebSocket';
      console.error('Erro WebSocket:', error);
    },

    /**
     * Handler para mensagens de notificação
     */
    handleNotification(data) {
      const notification = {
        id: data.id || Date.now(),
        title: data.title || 'Nova Notificação',
        message: data.message || data.content || '',
        type: data.type || 'info',
        timestamp: data.timestamp || new Date().toISOString(),
        read: false,
        data: data.data || {},
        priority: data.priority || 'normal',
        category: data.category || 'general',
        actionUrl: data.actionUrl || null,
        expiresAt: data.expiresAt || null,
      };

      this.addNotification(notification);
    },

    /**
     * Handler para mensagens genéricas
     */
    handleMessage(data) {
      // Processar o formato específico do backend
      if (data.titulo && data.nome_documento) {
        // Formato específico do backend: lembrete de documento
        const notification = {
          id: Date.now(),
          title: data.titulo,
          message: this.formatDocumentNotificationMessage(data),
          type: 'document',
          timestamp: new Date().toISOString(),
          read: false,
          data: {
            nome_documento: data.nome_documento,
            descricao_evento: data.descricao_evento,
            observacoes: data.observacoes
          },
          priority: 'high', // Lembretes de documento são de alta prioridade
          category: 'document',
          actionUrl: null,
          expiresAt: null,
        };

        this.addNotification(notification);
      } else if (data.type) {
        // Formato genérico com tipo específico
        this.handleNotification(data);
      } else {
        // Formato genérico sem tipo
        this.handleNotification({
          ...data,
          type: 'info',
          title: data.title || data.titulo || 'Mensagem do Sistema',
        });
      }
    },

    /**
     * Formata a mensagem para notificações de documento
     */
    formatDocumentNotificationMessage(data) {
      let message = '';

      if (data.nome_documento) {
        message += `<strong>Documento:</strong> ${data.nome_documento}<br>`;
      }

      if (data.descricao_evento) {
        message += `<strong>Evento:</strong> ${data.descricao_evento}<br>`;
      }

      if (data.observacoes) {
        message += `<strong>Observações:</strong> ${data.observacoes}`;
      }

      return message || 'Novo lembrete de documento';
    },

    /**
     * Adiciona uma nova notificação
     */
    addNotification(notification) {
      // Verificar se a notificação já existe
      const existingIndex = this.notifications.findIndex(n => n.id === notification.id);

      if (existingIndex !== -1) {
        // Atualizar notificação existente
        this.notifications[existingIndex] = {
          ...this.notifications[existingIndex],
          ...notification,
          read: this.notifications[existingIndex].read // Manter status de leitura
        };
      } else {
        // Adicionar nova notificação
        this.notifications.unshift(notification);

        // Limitar número de notificações em memória
        if (this.notifications.length > this.maxNotifications) {
          this.notifications = this.notifications.slice(0, this.maxNotifications);
        }
      }

      // Atualizar contador de não lidas
      this.updateUnreadCount();
    },

    /**
     * Marca notificação como lida
     */
    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        this.updateUnreadCount();
      }
    },

    /**
     * Marca todas as notificações como lidas
     */
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true;
      });
      this.updateUnreadCount();
    },

    /**
     * Remove uma notificação
     */
    removeNotification(notificationId) {
      const index = this.notifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        const wasUnread = !this.notifications[index].read;
        this.notifications.splice(index, 1);

        if (wasUnread) {
          this.updateUnreadCount();
        }
      }
    },

    /**
     * Remove notificações expiradas
     */
    removeExpiredNotifications() {
      const now = new Date();
      this.notifications = this.notifications.filter(notification => {
        if (!notification.expiresAt) return true;
        return new Date(notification.expiresAt) > now;
      });
      this.updateUnreadCount();
    },

    /**
     * Remove notificações antigas (mais de 30 dias)
     */
    removeOldNotifications() {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      this.notifications = this.notifications.filter(notification => {
        return new Date(notification.timestamp) > thirtyDaysAgo;
      });
      this.updateUnreadCount();
    },

    /**
     * Atualiza o contador de notificações não lidas
     */
    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => !n.read).length;
    },

    /**
     * Limpa todas as notificações
     */
    clearAllNotifications() {
      this.notifications = [];
      this.unreadCount = 0;
    },

    /**
     * Obtém notificações por categoria
     */
    getNotificationsByCategory(category) {
      return this.notifications.filter(n => n.category === category);
    },

    /**
     * Obtém notificações por prioridade
     */
    getNotificationsByPriority(priority) {
      return this.notifications.filter(n => n.priority === priority);
    },

    /**
     * Configura limite máximo de notificações
     */
    setMaxNotifications(max) {
      this.maxNotifications = max;

      // Aplicar limite imediatamente se necessário
      if (this.notifications.length > this.maxNotifications) {
        this.notifications = this.notifications.slice(0, this.maxNotifications);
        this.updateUnreadCount();
      }
    },

    /**
     * Reconecta o WebSocket
     */
    reconnect() {
      this.disconnectWebSocket();
      setTimeout(() => {
        this.initializeWebSocket();
      }, 1000);
    },

    /**
     * Obtém estatísticas das notificações
     */
    getNotificationStats() {
      const total = this.notifications.length;
      const unread = this.unreadCount;
      const read = total - unread;

      const byType = {};
      const byCategory = {};
      const byPriority = {};

      this.notifications.forEach(notification => {
        // Contagem por tipo
        byType[notification.type] = (byType[notification.type] || 0) + 1;

        // Contagem por categoria
        byCategory[notification.category] = (byCategory[notification.category] || 0) + 1;

        // Contagem por prioridade
        byPriority[notification.priority] = (byPriority[notification.priority] || 0) + 1;
      });

      return {
        total,
        unread,
        read,
        byType,
        byCategory,
        byPriority
      };
    },
  },
}); 
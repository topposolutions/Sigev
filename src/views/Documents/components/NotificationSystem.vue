<template>
  <div class="notification-system">
    <!-- Indicador de notificações não lidas -->
    <div
      v-if="notificationSystem && notificationSystem.unreadCount > 0"
      class="notification-indicator d-flex align-items-center gap-1"
    >
      <i class="bi bi-bell-fill text-warning"></i>
      <span class="badge bg-warning text-dark">{{
        notificationSystem.unreadCount
      }}</span>
      <button
        class="btn btn-sm btn-outline-primary"
        @click="markAllDocumentNotificationsAsRead"
      >
        Marcar como lidas
      </button>
    </div>

    <!-- Indicador específico para lembretes de documento -->
    <div
      v-if="
        notificationSystem &&
        notificationSystem.documentReminders &&
        notificationSystem.documentReminders.length > 0
      "
      class="document-reminders-indicator d-flex align-items-center gap-1"
    >
      <i class="bi bi-file-text text-info"></i>
      <span class="badge bg-info text-white">{{
        notificationSystem.documentReminders.length
      }}</span>
      <small class="text-muted">Lembretes</small>
    </div>
    
    <!-- Status da conexão WebSocket -->
    <div
      v-if="notificationSystem && notificationSystem.connectionStatus"
      class="connection-status"
    >
      <i
        v-if="notificationSystem.connectionStatus.isConnected"
        class="bi bi-wifi text-success"
        title="Conectado"
      ></i>
      <i
        v-else
        class="bi bi-wifi-off text-danger"
        title="Desconectado"
      ></i>
    </div>
  </div>
</template>

<script>
import { useDocumentNotifications } from "../../../composables/useNotifications.js";
import Swal from "sweetalert2";

export default {
  name: "NotificationSystem",
  data() {
    return {
      notificationSystem: {
        unreadCount: 0,
        documentReminders: [],
        notifications: [],
        connectionStatus: { isConnected: false, error: null }
      },
      notificationAudio: null, // Elemento de áudio para notificações
    };
  },
  mounted() {
    this.initializeNotifications();
    this.enableAudioOnUserInteraction();
  },
  methods: {
    // Inicializar sistema de notificações
    initializeNotifications() {
      // Inicializar áudio de notificação
      this.initializeNotificationAudio();
      
      try {
        // Usar o composable de notificações de documentos
        const {
          notifications,
          unreadCount,
          documentNotifications,
          documentReminders,
          uploadNotifications,
          processingNotifications,
          errorNotifications,
          markAsRead,
          markAllAsRead,
          removeNotification,
          markDocumentNotificationsAsRead,
          clearOldDocumentNotifications,
        } = useDocumentNotifications();

        // Armazenar métodos do composable
        this.notificationSystem.markAsRead = markAsRead;
        this.notificationSystem.markAllAsRead = markAllAsRead;
        this.notificationSystem.removeNotification = removeNotification;
        this.notificationSystem.markDocumentNotificationsAsRead = markDocumentNotificationsAsRead;
        this.notificationSystem.clearOldDocumentNotifications = clearOldDocumentNotifications;

        // Limpar notificações antigas ao inicializar
        if (this.notificationSystem.clearOldDocumentNotifications) {
          this.notificationSystem.clearOldDocumentNotifications();
        }
        
        // Adicionar dados mockados para demonstração
        this.addMockNotifications();
        
        // Simular notificações em tempo real (apenas para demonstração)
        this.startMockNotifications();
      } catch (error) {
        console.error('Erro ao inicializar notificações:', error);
        // Manter o sistema básico já inicializado no data()
      }
    },
    
    // Inicializar áudio de notificação
    initializeNotificationAudio() {
      try {
        // Criar elemento de áudio
        this.notificationAudio = new Audio();
        
        // Definir fonte do áudio (sino)
        this.notificationAudio.src = this.getNotificationSound();
        
        // Configurar volume (0.0 a 1.0)
        this.notificationAudio.volume = 0.5;
        
        // Configurar duração máxima de 2 segundos
        this.notificationAudio.addEventListener('loadedmetadata', () => {
          if (this.notificationAudio.duration > 2) {
            this.notificationAudio.duration = 2;
          }
        });
        
        console.log('Áudio de notificação inicializado com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar áudio de notificação:', error);
      }
    },
    
    // Obter som de notificação (sino)
    getNotificationSound() {
      // Opção 1: Som de sino usando Web Audio API (sintetizado)
      return this.createBellSound();
      
      // Opção 2: Arquivo de áudio local (descomente se tiver um arquivo)
      // return '/sounds/bell-notification.mp3';
    },
    
    // Criar som de sino sintetizado
    createBellSound() {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Criar múltiplos osciladores para um som mais rico
        const oscillators = [];
        const gainNodes = [];
        
        // Frequências para simular um sino (harmônicos)
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const volumes = [0.4, 0.3, 0.2, 0.1];
        
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          // Configurar frequência
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          
          // Configurar envelope de volume (fade in/out)
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(volumes[index], audioContext.currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
          
          // Conectar nós
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillators.push(oscillator);
          gainNodes.push(gainNode);
        });
        
        // Tocar todos os osciladores
        oscillators.forEach(oscillator => {
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 2);
        });
        
        return null; // Não retorna URL, pois o som é sintetizado
      } catch (error) {
        console.error('Erro ao criar som de sino:', error);
        return null;
      }
    },
    
    // Tocar som de notificação
    playNotificationSound() {
      try {
        if (this.notificationAudio) {
          // Se temos um arquivo de áudio
          if (this.notificationAudio.src) {
            this.notificationAudio.currentTime = 0;
            this.notificationAudio.play().catch(error => {
              console.error('Erro ao tocar áudio:', error);
            });
          } else {
            // Se não temos arquivo, criar som sintetizado
            this.createBellSound();
          }
        }
      } catch (error) {
        console.error('Erro ao tocar som de notificação:', error);
      }
    },
    
    // Ativar áudio quando o usuário interagir com a página
    enableAudioOnUserInteraction() {
      const enableAudio = () => {
        // Criar um contexto de áudio para "desbloquear" o áudio
        if (this.notificationAudio) {
          this.notificationAudio.play().then(() => {
            this.notificationAudio.pause();
            this.notificationAudio.currentTime = 0;
            console.log('Áudio ativado com sucesso');
          }).catch(error => {
            console.log('Áudio ainda não pode ser tocado:', error);
          });
        }
        
        // Remover event listeners após primeira interação
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
      };
      
      // Adicionar event listeners para primeira interação
      document.addEventListener('click', enableAudio, { once: true });
      document.addEventListener('keydown', enableAudio, { once: true });
      document.addEventListener('touchstart', enableAudio, { once: true });
    },
    
    // Adicionar dados mockados para demonstração
    addMockNotifications() {
      // Mock de notificações não lidas
      this.notificationSystem.unreadCount = 5;
      
      // Mock de lembretes de documentos
      this.notificationSystem.documentReminders = [
        {
          id: 1,
          nome_documento: "Contrato de Prestação de Serviços",
          descricao_evento: "Vencimento do contrato",
          observacoes: "Renovar contrato antes do vencimento",
          data_lembrete: "2024-08-15T10:00:00",
          prioridade: "alta"
        },
        {
          id: 2,
          nome_documento: "Relatório Mensal",
          descricao_evento: "Entrega do relatório",
          observacoes: "Preparar relatório para reunião",
          data_lembrete: "2024-08-20T14:30:00",
          prioridade: "média"
        },
        {
          id: 3,
          nome_documento: "Ação Trabalhista",
          descricao_evento: "Audiência judicial",
          observacoes: "Preparar documentação para audiência",
          data_lembrete: "2024-08-25T09:00:00",
          prioridade: "crítica"
        }
      ];
      
      // Mock de status de conexão
      this.notificationSystem.connectionStatus = {
        isConnected: true,
        lastPing: new Date(),
        error: null
      };
      
      // Mock de notificações gerais
      this.notificationSystem.notifications = [
        {
          id: 1,
          title: "Documento Processado",
          message: "O documento 'Contrato XYZ' foi processado com sucesso",
          type: "success",
          timestamp: new Date(Date.now() - 300000), // 5 minutos atrás
          read: false,
          category: "document"
        },
        {
          id: 2,
          title: "Lembrete Importante",
          message: "Vencimento do contrato em 3 dias",
          type: "warning",
          timestamp: new Date(Date.now() - 600000), // 10 minutos atrás
          read: false,
          category: "reminder"
        },
        {
          id: 3,
          title: "Erro no Processamento",
          message: "Falha ao processar documento 'Relatório ABC'",
          type: "error",
          timestamp: new Date(Date.now() - 900000), // 15 minutos atrás
          read: true,
          category: "processing"
        }
      ];
    },
    
    // Simular notificações em tempo real para demonstração
    startMockNotifications() {
      // Simular nova notificação a cada 30 segundos
      setInterval(() => {
        const mockNotifications = [
          {
            title: "Novo Documento Processado",
            message: "Documento 'Relatório Trimestral' foi processado com sucesso",
            type: "success",
            category: "document"
          },
          {
            title: "Lembrete de Vencimento",
            message: "Contrato vence em 2 dias - ação necessária",
            type: "warning",
            category: "reminder"
          },
          {
            title: "Erro de Processamento",
            message: "Falha ao processar documento 'Contrato ABC'",
            type: "error",
            category: "processing"
          }
        ];
        
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        
        // Adicionar nova notificação
        this.notificationSystem.notifications.unshift({
          id: Date.now(),
          ...randomNotification,
          timestamp: new Date(),
          read: false
        });
        
        // Incrementar contador de não lidas
        this.notificationSystem.unreadCount++;
        
        // Mostrar toast de notificação
        this.showMockNotificationToast(randomNotification);
      }, 30000); // 30 segundos
    },
    
    // Mostrar toast de notificação mockada
    showMockNotificationToast(notification) {
      // Tocar som de notificação
      this.playNotificationSound();
      
      Swal.fire({
        title: notification.title,
        text: notification.message,
        icon: notification.type,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'notification-toast-minimal',
          title: 'notification-title-minimal',
          icon: 'notification-icon-minimal',
          content: 'notification-content-minimal'
        }
      });
    },
    
    // Método para processar notificações recebidas
    handleDocumentNotification(notification) {
      // Se a notificação for relacionada a documentos, atualizar a lista
      if (
        notification.category === "document" ||
        notification.type === "document"
      ) {
        // Mostrar notificação específica para lembretes de documento
        this.showDocumentReminderNotification(notification);
      }

      // Se for notificação de processamento, mostrar feedback visual
      if (notification.type === "processing") {
        this.showProcessingNotification(notification);
      }

      // Se for notificação de erro, mostrar alerta
      if (notification.type === "error") {
        this.showErrorNotification(notification);
      }
    },

    // Mostrar notificação específica para lembretes de documento
    showDocumentReminderNotification(notification) {
      // Tocar som de notificação
      this.playNotificationSound();
      
      const documentName = notification.data?.nome_documento || "Documento";
      const eventDescription = notification.data?.descricao_evento || "";
      const observations = notification.data?.observacoes || "";

      let message = `<div class="document-notification-content">`;
      message += `<div class="document-name"><strong>${documentName}</strong></div>`;
      if (eventDescription) {
        message += `<div class="event-description">${eventDescription}</div>`;
      }
      if (observations) {
        message += `<div class="observations">${observations}</div>`;
      }
      message += `</div>`;

      Swal.fire({
        title: notification.title,
        html: message,
        icon: "info",
        confirmButtonText: "Ver Documento",
        showCancelButton: true,
        cancelButtonText: "Fechar",
        customClass: {
          popup: 'document-notification-modal',
          title: 'document-notification-title',
          icon: 'document-notification-icon',
          content: 'document-notification-content',
          confirmButton: "btn btn-primary btn-sm",
          cancelButton: "btn btn-outline-secondary btn-sm",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          // Aqui você pode implementar a navegação para o documento
          console.log("Navegar para documento:", documentName);
          // Exemplo: this.$router.push({ name: 'DocumentDetails', params: { id: documentId } });
        }
      });
    },

    // Mostrar notificação de processamento
    showProcessingNotification(notification) {
      // Pode ser implementado com loading ou toast específico
      console.log("Processamento em andamento:", notification.message);
    },

    // Mostrar notificação de erro
    showErrorNotification(notification) {
      Swal.fire({
        title: "Erro no Processamento",
        text: notification.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    },

    // Marcar todas as notificações de documento como lidas
    markAllDocumentNotificationsAsRead() {
      // Resetar contador local
      this.notificationSystem.unreadCount = 0;
      
      // Marcar todas as notificações como lidas
      this.notificationSystem.notifications.forEach(notification => {
        notification.read = true;
      });
      
      // Chamar método do composable se disponível
      if (this.notificationSystem.markDocumentNotificationsAsRead) {
        this.notificationSystem.markDocumentNotificationsAsRead();
      }
      
      Swal.fire({
        title: "Sucesso",
        text: "Todas as notificações foram marcadas como lidas",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
  },
};
</script>

<style scoped>
.notification-system {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Estilos para indicadores de notificação */
.notification-indicator {
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 193, 7, 0.1);
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 193, 7, 0.2);
  animation: notification-pulse 2s infinite;
}

.document-reminders-indicator {
  padding: 0.25rem 0.5rem;
  background-color: rgba(13, 202, 240, 0.1);
  border-radius: 0.375rem;
  border: 1px solid rgba(13, 202, 240, 0.2);
  animation: notification-pulse 3s infinite;
}

.connection-status {
  padding: 0.25rem;
  border-radius: 0.25rem;
  background-color: rgba(0, 0, 0, 0.05);
}

.connection-status i {
  font-size: 1rem;
}

/* Animação para notificações não lidas */
@keyframes notification-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

   
 .notification-toast-minimal  {
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  padding: 12px 16px !important;
  min-width: 300px !important;
  max-width: 400px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}
 
.notification-title-minimal {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #1f2937 !important;
  margin-bottom: 4px !important;
  line-height: 1.4 !important;
}

.notification-icon-minimal{
  font-size: 16px !important;
  margin-right: 8px !important;
  margin-bottom: 0 !important;
}

.notification-content-minimal {
  font-size: 13px !important;
  color: #6b7280 !important;
  line-height: 1.4 !important;
  margin-top: 0 !important;
}

/* Ajustes específicos para diferentes tipos de notificação */
.swal2-icon.swal2-success{
  border-color: #10b981 !important;
  color: #10b981 !important;
}

.swal2-icon.swal2-warning {
  border-color: #f59e0b !important;
  color: #f59e0b !important;
}

.swal2-icon.swal2-error {
  border-color: #ef4444 !important;
  color: #ef4444 !important;
}

.swal2-icon.swal2-info {
  border-color: #3b82f6 !important;
  color: #3b82f6 !important;
}

/* Layout flexível para o conteúdo */
swal2-popup {
  display: flex !important;
  align-items: flex-start !important;
  gap: 8px !important;
}

.swal2-content{
  flex: 1 !important;
  text-align: left !important;
}

/* Progress bar minimalista */
.swal2-timer-progress-bar{
  background: linear-gradient(90deg, #3b82f6, #1d4ed8) !important;
  height: 2px !important;
  border-radius: 1px !important;
}

/* Estilos para modal de notificação de documento */
:global(.document-notification-modal) {
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  padding: 24px !important;
  max-width: 450px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

:global(.document-notification-title) {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #1f2937 !important;
  margin-bottom: 16px !important;
  line-height: 1.4 !important;
  text-align: left !important;
}

:global(.document-notification-icon) {
  font-size: 20px !important;
  margin-right: 12px !important;
  margin-bottom: 0 !important;
}

:global(.document-notification-content) {
  font-size: 14px !important;
  color: #6b7280 !important;
  line-height: 1.5 !important;
  margin-top: 0 !important;
  text-align: left !important;
}

/* Estilos para o conteúdo da notificação de documento */
:global(.document-notification-content .document-name) {
  font-size: 15px !important;
  font-weight: 600 !important;
  color: #1f2937 !important;
  margin-bottom: 8px !important;
}

:global(.document-notification-content .event-description) {
  font-size: 13px !important;
  color: #374151 !important;
  margin-bottom: 6px !important;
  padding-left: 8px !important;
  border-left: 2px solid #e5e7eb !important;
}

:global(.document-notification-content .observations) {
  font-size: 12px !important;
  color: #6b7280 !important;
  font-style: italic !important;
  margin-top: 8px !important;
  padding: 8px 12px !important;
  background-color: #f9fafb !important;
  border-radius: 6px !important;
  border-left: 3px solid #3b82f6 !important;
}

/* Botões minimalistas */
:global(.document-notification-modal .btn) {
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 8px 16px !important;
  border-radius: 6px !important;
  transition: all 0.2s ease !important;
}

:global(.document-notification-modal .btn-primary) {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  border: none !important;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2) !important;
}

:global(.document-notification-modal .btn-primary:hover) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3) !important;
}

:global(.document-notification-modal .btn-outline-secondary) {
  border: 1px solid #d1d5db !important;
  color: #6b7280 !important;
  background: transparent !important;
}

:global(.document-notification-modal .btn-outline-secondary:hover) {
  background-color: #f3f4f6 !important;
  border-color: #9ca3af !important;
  color: #374151 !important;
}
</style> 
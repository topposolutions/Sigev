import JwtService from './jwt.service';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // 1 segundo
    this.maxReconnectDelay = 30000; // 30 segundos
    this.isConnecting = false;
    this.isConnected = false;
    this.eventListeners = new Map();
    this.connectionUrl = null;
  }

  /**
   * Conecta ao WebSocket
   * @param {string} url - URL do WebSocket
   * @param {Object} options - Opções de conexão
   */
  connect(url, options = {}) {
    if (this.isConnecting || this.isConnected) {
      console.warn('WebSocket já está conectando ou conectado');
      return;
    }

    this.connectionUrl = url;
    this.isConnecting = true;

    console.log('Tentando conectar ao WebSocket:', url);

    try {
      this.ws = new WebSocket(url);
      this.setupEventHandlers();
    } catch (error) {
      console.error('Erro ao criar conexão WebSocket:', error);
      this.handleConnectionError(error);
    }
  }

  /**
   * Configura os event handlers do WebSocket
   */
  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log('WebSocket conectado com sucesso');
      this.isConnecting = false;
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
        this.emit('error', { type: 'parse_error', error });
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket desconectado:', event.code, event.reason);
      this.isConnecting = false;
      this.isConnected = false;
      this.emit('disconnected', event);
      
      if (!event.wasClean) {
        this.handleReconnection();
      }
    };

    this.ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      console.error('Detalhes do erro:', {
        url: this.connectionUrl,
        readyState: this.ws.readyState,
        error: error
      });
      this.handleConnectionError(error);
    };
  }

  /**
   * Processa mensagens recebidas
   * @param {Object} data - Dados da mensagem
   */
  handleMessage(data) {
    // Emite evento genérico de mensagem
    this.emit('message', data);

    // Emite evento específico baseado no tipo da mensagem
    if (data.type) {
      this.emit(data.type, data);
    }
  }

  /**
   * Envia mensagem através do WebSocket
   * @param {Object|string} data - Dados para enviar
   */
  send(data) {
    if (!this.isConnected || !this.ws) {
      console.warn('WebSocket não está conectado');
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem WebSocket:', error);
      this.emit('error', { type: 'send_error', error });
      return false;
    }
  }

  /**
   * Desconecta o WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Desconexão solicitada pelo usuário');
      this.ws = null;
    }
    this.isConnecting = false;
    this.isConnected = false;
    this.reconnectAttempts = 0;
  }

  /**
   * Gerencia reconexão automática
   */
  handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Número máximo de tentativas de reconexão atingido');
      this.emit('max_reconnect_attempts_reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    console.log(`Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts} em ${delay}ms`);
    
    setTimeout(() => {
      if (!this.isConnected && this.connectionUrl) {
        this.connect(this.connectionUrl);
      }
    }, delay);
  }

  /**
   * Gerencia erros de conexão
   * @param {Error} error - Erro ocorrido
   */
  handleConnectionError(error) {
    this.isConnecting = false;
    this.emit('error', { type: 'connection_error', error });
  }

  /**
   * Adiciona listener para eventos
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função callback
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove listener para eventos
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função callback
   */
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emite evento para todos os listeners
   * @param {string} event - Nome do evento
   * @param {*} data - Dados do evento
   */
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Erro no listener do evento ${event}:`, error);
        }
      });
    }
  }

  /**
   * Remove todos os listeners
   */
  clearListeners() {
    this.eventListeners.clear();
  }

  /**
   * Obtém o status da conexão
   * @returns {Object} Status da conexão
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }

  /**
   * Configura opções de reconexão
   * @param {Object} options - Opções de reconexão
   */
  setReconnectionOptions(options) {
    if (options.maxAttempts !== undefined) {
      this.maxReconnectAttempts = options.maxAttempts;
    }
    if (options.delay !== undefined) {
      this.reconnectDelay = options.delay;
    }
    if (options.maxDelay !== undefined) {
      this.maxReconnectDelay = options.maxDelay;
    }
  }
}

// Instância singleton
const webSocketService = new WebSocketService();

export default webSocketService; 
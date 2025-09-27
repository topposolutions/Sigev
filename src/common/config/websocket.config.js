import { ENDPOINT_WEB_SOCKET_CONNECTION } from "../services/config";

/**
 * Configurações do WebSocket
 */
export const WEBSOCKET_CONFIG = {
  // URL base do WebSocket
  //BASE_URL: 'wss://ceos-api.duckdns.org/ws',
  BASE_URL: ENDPOINT_WEB_SOCKET_CONNECTION,
  
  // Configurações de reconexão
  RECONNECTION: {
    maxAttempts: 10,
    initialDelay: 1000, // 1 segundo
    maxDelay: 30000, // 30 segundos
    backoffMultiplier: 2,
  },
  
  // Configurações de notificações
  NOTIFICATIONS: {
    maxInMemory: 100,
    autoRemoveAfter: 30 * 24 * 60 * 60 * 1000, // 30 dias em ms
    autoRemoveExpired: true,
    showConnectionStatus: true,
  },
  
  // Tipos de notificação suportados
  NOTIFICATION_TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    UPLOAD: 'upload',
    PROCESSING: 'processing',
    DOCUMENT: 'document',
    SYSTEM: 'system',
  },
  
  // Categorias de notificação
  NOTIFICATION_CATEGORIES: {
    GENERAL: 'general',
    DOCUMENT: 'document',
    SYSTEM: 'system',
    USER: 'user',
    PROCESSING: 'processing',
  },
  
  // Prioridades de notificação
  NOTIFICATION_PRIORITIES: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    CRITICAL: 'critical',
  },
  
  // Configurações de heartbeat/ping
  HEARTBEAT: {
    enabled: true,
    interval: 30000, // 30 segundos
    timeout: 5000, // 5 segundos
  },
  
  // Configurações de debug
  DEBUG: {
    enabled: process.env.NODE_ENV === 'development',
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
  },
};

/**
 * Gera URL completa do WebSocket com token
 * @param {string} token - Token JWT
 * @returns {string} URL completa do WebSocket
 */
export function getWebSocketUrl(token) {
  if (!token) {
    throw new Error('Token é obrigatório para conexão WebSocket');
  }
  
  return `${WEBSOCKET_CONFIG.BASE_URL}?token=${encodeURIComponent(token)}`;
}

/**
 * Configurações específicas para diferentes ambientes
 */
export const ENVIRONMENT_CONFIG = {
  development: {
    ...WEBSOCKET_CONFIG,
    DEBUG: {
      ...WEBSOCKET_CONFIG.DEBUG,
      enabled: true,
      logLevel: 'debug',
    },
  },
  
  production: {
    ...WEBSOCKET_CONFIG,
    DEBUG: {
      ...WEBSOCKET_CONFIG.DEBUG,
      enabled: false,
      logLevel: 'error',
    },
    RECONNECTION: {
      ...WEBSOCKET_CONFIG.RECONNECTION,
      maxAttempts: 10,
    },
  },
  
  test: {
    ...WEBSOCKET_CONFIG,
    DEBUG: {
      ...WEBSOCKET_CONFIG.DEBUG,
      enabled: true,
      logLevel: 'warn',
    },
    HEARTBEAT: {
      ...WEBSOCKET_CONFIG.HEARTBEAT,
      enabled: false,
    },
  },
};

/**
 * Obtém configuração baseada no ambiente atual
 * @returns {Object} Configuração do ambiente atual
 */
export function getCurrentConfig() {
  const env = process.env.NODE_ENV || 'development';
  return ENVIRONMENT_CONFIG[env] || ENVIRONMENT_CONFIG.development;
}

export default WEBSOCKET_CONFIG; 
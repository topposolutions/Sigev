<template>
  <div class="welcome-message">
    <div class="text-center">
      <MessageCircle :size="50" class="text-muted mb-3" />
      <h5 class="text-muted">Bem-vindo ao Chat de Documentos!</h5>
      <p class="text-muted mb-4">
        Anexe documentos e faça perguntas sobre eles. Posso ajudar você a:
      </p>
      <div class="features-grid">
        <div class="feature-item">
          <Search :size="27" class="feature-icon feature-icon-blue" />
          <div class="feature-title">Buscar informações</div>
          <div class="feature-desc">
            Encontre conteúdo específico nos documentos
          </div>
        </div>
        <div class="feature-item">
          <FileText :size="27" class="feature-icon feature-icon-green" />
          <div class="feature-title">Resumir conteúdo</div>
          <div class="feature-desc">Obtenha resumos de documentos longos</div>
        </div>
        <div class="feature-item">
          <HelpCircle :size="27" class="feature-icon feature-icon-cyan" />
          <div class="feature-title">Responder perguntas</div>
          <div class="feature-desc">Tire dúvidas baseadas no conteúdo</div>
        </div>
        <div class="feature-item">
          <BarChart3 :size="27" class="feature-icon feature-icon-yellow" />
          <div class="feature-title">Analisar dados</div>
          <div class="feature-desc">Extraia insights dos documentos</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  MessageCircle,
  Search,
  FileText,
  HelpCircle,
  BarChart3,
} from "lucide-vue-next";
</script>

<style scoped>
.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 20px 24px 18px 24px;
  min-width: 0;
  min-height: 120px;
  box-shadow: 0 2px 8px 0 rgba(31, 41, 55, 0.04);
  transition: box-shadow 0.18s;
}
.feature-item:hover {
  box-shadow: 0 4px 24px 0 rgba(31, 41, 55, 0.1);
}

.feature-icon {
  margin-bottom: 12px;
}
.feature-icon-blue {
  color: #2563eb;
}
.feature-icon-green {
  color: #22c55e;
}
.feature-icon-cyan {
  color: #06b6d4;
}
.feature-icon-yellow {
  color: #eab308;
}

.feature-title {
  font-weight: 600;
  font-size: 1.01rem;
  color: #1f2937;
  margin-bottom: 4px;
}

.feature-desc {
  color: #6b7280;
  font-size: 0.93rem;
}

.welcome-message {
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 20px;
}
</style>

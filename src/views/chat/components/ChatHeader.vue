<template>
  <div class="chat-header">
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <MessageCircle :size="24" class="text-primary me-2" />
        <div>
          <h5 class="mb-0">Assistente de Documentos</h5>
          <small class="text-muted">Faça perguntas sobre seus documentos</small>
        </div>
      </div>
      <div class="d-flex gap-2">
        <button
          class="btn btn-sm btn-outline-secondary"
          @click="$emit('clear-chat', $route.params.id)"
          :disabled="messagesLength === 0"
        >
          <Trash2 :size="16" />
        </button>
        <button
          class="btn btn-sm btn-outline-secondary"
          @click="$emit('toggle-sidebar')"
        >
          <PanelRightOpen :size="16" />
        </button>
        <button
          class="btn btn-sm btn-primary"
          @click="$emit('new-conversation-tab')"
          style="min-width: 110px; font-weight: 500"
        >
          + Nova Conversa
        </button>
        <button
          class="btn btn-sm btn-primary"
          @click="$emit('toggle-conversations-drawer')"
          style="min-width: 110px; font-weight: 500"
        >
          Conversas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { MessageCircle, Trash2, PanelRightOpen } from "lucide-vue-next";

defineProps<{ messagesLength: number }>();
defineEmits([
  "clear-chat",
  "toggle-sidebar",
  "toggle-conversations-drawer",
  "new-conversation-tab",
]);
</script>

<style scoped>
.chat-header {
  border-bottom: 1px solid var(--border-color);
  background-color: white;
  flex-shrink: 0;
}
</style>

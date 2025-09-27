<template>
  <div>
    
    <div v-for="message in messages" :key="message.id" class="message-wrapper">
      <ChatMessage
        :message="message"
        @send-suggested-question="$emit('send-suggested-question', $event)"
      />
    </div>
    <div v-if="isTyping" class="message-wrapper">
      <div class="message assistant-message">
        <div class="message-avatar">
          <div class="avatar assistant-avatar">
            <Bot :size="16" />
          </div>
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <small class="text-muted ms-2">Assistente está pensando...</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bot } from "lucide-vue-next";
import ChatMessage from "./ChatMessage.vue"; 

export default {
  name: "ChatMessages",
  components: {
    Bot,
    ChatMessage,
  },
  props: {
    messages: {
      type: Array,
      required: true,
    },
    isTyping: {
      type: Boolean,
      required: true,
    },
  },
};
</script>


<style scoped>
.message-wrapper {
  margin-bottom: var(--spacing-lg);
}
.typing-indicator {
  display: flex;
  align-items: center;
}

.typing-dots {
  display: flex;
  gap: 4px;
}
.typing-dots span {
  width: 6px;
  height: 6px;
  background-color: var(--text-secondary);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}
@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

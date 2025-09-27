<template>
  <div class="conversations-drawer" :class="{ show: show }">
    <div
      class="drawer-header d-flex align-items-center justify-content-between px-3 py-2"
    >
      <span class="fw-bold">Conversas</span>
      <button
        class="btn btn-sm btn-link"
        @click="$emit('toggle-conversations-drawer')"
      >
        <X :size="16" />
      </button>
    </div>
    <div class="drawer-content">
      <div
        v-if="!computedConversations.length"
        class="text-center py-4 text-muted"
      >
        Nenhuma conversa encontrada
      </div>
      <div v-else>
        <div
          v-for="conv in computedConversations"
          :key="conv.id"
          :class="[
            'conversation-item',
            { active: conv.id === activeConversationId },
          ]"
          @mouseenter="$emit('hover-conversation', conv.id)"
          @mouseleave="$emit('hover-conversation', null)"
          style="position: relative"
        >
          <div class="d-flex align-items-center justify-content-between">
            <div @click="redirectToConversation(conv.id)">
              <div class="conversation-title-wrapper">
                <div class="conversation-title text-truncate">
                  {{ conv.titulo }}
                  <span class="tooltip-text">{{ conv.titulo }}</span>
                </div>
              </div>
              <div class="conversation-date small">
                {{ formatDate(conv.criado_em) }}
              </div>
            </div>
            <button
              v-if="hoveredConversationId === conv.id"
              class="btn btn-sm btn-menu"
              @click.stop="$emit('open-menu', conv.id, $event)"
              style="margin-left: 8px"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="4" cy="10" r="1.5" fill="currentColor" />
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                <circle cx="16" cy="10" r="1.5" fill="currentColor" />
              </svg>
            </button>
          </div>
          <transition name="fade">
            <div
              v-if="menuOpenId === conv.id"
              class="conversation-menu"
              :style="{ top: '38px', right: '0', minWidth: '180px' }"
            >
              <div
                class="menu-item menu-delete d-flex align-items-center gap-2"
                @click.stop="handleDeleteConversation(conv.id)"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#ef4444"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  viewBox="0 0 24 24"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                  />
                </svg>
                <span class="delete-text">Excluir</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { X } from "lucide-vue-next";
import helpers from "../../../common/services/helpers.js";

export default {
  name: "ConversationsDrawer",
  components: {
    X,
  },
  props: {
    conversations: {
      type: Array,
      default: () => [],
    },
    activeConversationId: {
      type: String,
      default: null,
    },
    hoveredConversationId: {
      type: [String, null],
      default: null,
    },
    menuOpenId: {
      type: [String, null],
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    redirectToConversation(id) {
      this.$emit("close-conversations-drawer");
      this.$router.push({ name: "ChatWithId", params: { id } });
    },
    handleDeleteConversation(id) {
      this.$emit("delete-conversation", id);
      if (this.$route.params.id === id) {
        this.$router.push({ name: "Chat" });
      }
    },
    formatDate(date) {
      return helpers.getDateFormattedWithSeconds(date, "DD/MM/YYYY");
    },
    handleClickOutside(event) {
      if (
        !event.target.closest(".conversation-menu") &&
        !event.target.closest(".btn-menu")
      ) {
        if (this.menuOpenId !== null) {
          this.$emit("open-menu", null, event);
        }
      }
    },
  },
  mounted() {
    if (typeof window !== "undefined") {
      window.addEventListener("click", this.handleClickOutside);
    }
  },
  beforeUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("click", this.handleClickOutside);
    }
  },
  computed: {
    computedConversations() {
      if (!this.conversations.length) return [];
      return this.conversations.filter((item) => item.titulo);
    },
  },
};
</script>

<style scoped>
.conversations-drawer {
  position: fixed;
  top: 0;
  right: -320px;
  width: 320px;
  height: 100vh;
  background: var(--bg-light);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
  border-left: 1px solid var(--border-color);
  z-index: 1200;
  transition: right 0.3s;
  display: flex;
  flex-direction: column;
}

.conversations-drawer.show {
  right: 0;
}

.drawer-header {
  border-bottom: 1px solid var(--border-color);
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0.5rem;
}

.conversation-item {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: background 0.2s, border-color 0.2s;
  border-radius: 0.5rem;
}

.conversation-item.active {
  background: var(--primary-color);
  color: var(--text-light);
  border-left: 4px solid var(--accent-color);
}

.conversation-item:hover {
  background: var(--primary-color);
  color: var(--text-light);
}

.conversation-title {
  font-weight: 500;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  display: inline-block;
}
.conversation-title {
  font-weight: 500;
  font-size: 1rem;
}
.conversation-title-wrapper {
  position: relative;
  max-width: 250px;
}

.conversation-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tooltip-text {
  visibility: hidden;
  width: auto;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 60%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.conversation-title:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.conversation-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.btn-menu {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 2px 4px;
  border-radius: 50%;
  transition: background 0.2s;
  cursor: pointer;
}

.btn-menu:hover {
  background: var(--border-color);
}

.conversation-menu {
  position: absolute;
  min-width: 180px;
  background: var(--bg-light);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  border-radius: 0.75rem;
  z-index: 10;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  right: 0;
  top: 38px;
  animation: fadeIn 0.18s;
}


.menu-item {
  padding: 0.35rem 0.8rem;
  font-size: 0.98rem;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}

.menu-item:hover {
  background: #f3f4f6;
}
.conversation-item {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: background 0.2s, border-color 0.2s;
  border-radius: 0.5rem;
}

.conversation-item.active {
  background: var(--primary-color);
  color: var(--text-light);
  border-left: 4px solid var(--accent-color);
}

.conversation-item:hover {
  background: var(--primary-color);
  color: var(--text-light);
}
.conversations-drawer {
  position: fixed;
  top: 0;
  right: -320px;
  width: 320px;
  height: 100vh;
  background: var(--bg-light);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
  border-left: 1px solid var(--border-color);
  z-index: 1200;
  transition: right 0.3s;
  display: flex;
  flex-direction: column;
}
.drawer-header {
  border-bottom: 1px solid var(--border-color);
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0.5rem;
}
.conversations-drawer.show {
  right: 0;
}
.menu-item:hover {
  background: #f3f4f6;
}
.conversation-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.btn-menu {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 2px 4px;
  border-radius: 50%;
  transition: background 0.2s;
  cursor: pointer;
}

.btn-menu:hover {
  background: var(--border-color);
}
.menu-delete svg {
  margin-right: 2px;
}
.menu-delete svg {
  margin-right: 2px;
}

.delete-text {
  font-size: 0.93rem;
  color: #ef4444;
  font-weight: 500;
}
.delete-text {
  font-size: 0.93rem;
  color: #ef4444;
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}



@media (max-width: 768px) {
  .message-content {
    max-width: 85%;
  }

  .document-sidebar {
    width: 100%;
    right: -100%;
  }

  .quick-actions {
    justify-content: center;
  }

  .suggestions-list {
    justify-content: center;
  }
}

@media (max-width: 700px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}
</style>

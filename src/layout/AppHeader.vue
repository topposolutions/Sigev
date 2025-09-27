<template>
  <header class="app-header shadow-sm">
    <div class="container-fluid">
      <div class="d-flex align-items-center justify-content-between py-3">
        <div class="d-flex align-items-center">
          <button
            class="btn btn-link text-secondary me-3 d-lg-none"
            @click="$emit('toggleSidebar')"
          >
            <Menu :size="20" />
          </button>

          <div class="page-title">
            <h4 class="mb-0 fw-semibold text-dark">{{ pageTitle }}</h4>
            <small class="text-muted" v-if="pageSubtitle">{{
              pageSubtitle
            }}</small>
          </div>
        </div>

        <div class="d-flex align-items-center gap-3">
          <!-- 
          <div class="search-container position-relative d-none d-md-block">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0">
                <Search :size="16" class="text-muted" />
              </span>
              <input
                type="text"
                class="form-control search-box border-start-0 bg-light"
                placeholder="Buscar documentos..."
                @click="$emit('toggleSearch')"
                readonly
              />
              <span class="input-group-text bg-light border-start-0">
                <kbd class="bg-white border">Ctrl+K</kbd>
              </span>
            </div>
          </div>

          <button
            class="btn btn-light d-md-none"
            @click="$emit('toggleSearch')"
          >
            <Search :size="18" />
          </button>

          <div class="dropdown">
            <button
              class="btn btn-light position-relative notification-btn"
              @click="toggleNotificationsMenu"
              type="button"
            >
              <Bell :size="20" />
              <span
                v-if="notifications.length > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style="font-size: 0.7em"
              >
                {{ notifications.length }}
              </span>
            </button>
            <div
              v-if="showNotificationsMenu"
              class="notifications-dropdown shadow-lg"
            >
              <div
                class="notifications-header d-flex align-items-center justify-content-between px-3 py-2"
              >
                <span class="fw-bold">Notificações</span>
                <button
                  class="btn btn-sm btn-link text-primary"
                  @click="markAllAsRead"
                >
                  Marcar todas como lidas
                </button>
              </div>
              <div class="notifications-list">
                <div
                  v-if="notifications.length === 0"
                  class="text-center text-muted py-4"
                >
                  Nenhuma notificação
                </div>
                <div v-else>
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="notification-item d-flex align-items-start gap-3 px-3 py-3 rounded mb-1"
                  >
                    <div
                      class="notification-icon d-flex align-items-center justify-content-center rounded-circle me-2"
                      :class="notification.color"
                    >
                      <component :is="notification.icon" :size="22" />
                    </div>
                    <div class="flex-grow-1">
                      <div class="fw-semibold mb-1">
                        {{ notification.title }}
                      </div>
                      <div class="text-secondary small mt-1">
                        {{ notification.time }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="notifications-footer text-center py-2">
                <router-link
                  to="/settings?section=notifications"
                  class="text-primary small"
                  >Ver todas as notificações</router-link
                >
              </div>
            </div>
          </div>
           

          <!-- User Menu -->
          <div class="dropdown">
            <button
              class="btn btn-light d-flex align-items-center user-menu-btn"
              @click="toggleUserMenu"
              type="button"
            >
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                alt="Avatar"
                class="rounded-circle me-2"
                width="32"
                height="32"
              />
              <span class="fw-semibold d-none d-md-inline">Admin</span>
              <ChevronDown :size="18" class="ms-1" />
            </button>
            <div v-if="showUserMenu" class="user-dropdown-menu shadow-lg">
              <div class="user-dropdown-header">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                  alt="Avatar"
                  class="rounded-circle me-2"
                  width="40"
                  height="40"
                />
                <div>
                  <div class="fw-semibold">admin@ceo.com</div>
                  <small class="text-muted">talkto@ceo.com</small>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <router-link to="/profile" class="user-dropdown-item">
                <User :size="16" class="me-2" /> Meu Perfil
              </router-link>
              <router-link to="/settings" class="user-dropdown-item">
                <Settings :size="16" class="me-2" /> Configurações
              </router-link>
              <router-link
                to="/settings?section=security"
                class="user-dropdown-item"
              >
                <Lock :size="16" class="me-2" /> Alterar Senha
              </router-link>
              <div class="dropdown-divider"></div>
              <div
                class="user-dropdown-item text-danger"
                @click="onLogoutClick"
                :disabled="pending"
              >
                <LogOut :size="16" class="me-2" /> Sair
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  FileText,
  AlertCircle,
  CheckCircle,
  User,
  Lock,
} from "lucide-vue-next";
import { useLogout } from "../composables/useLogout.js";

export default {
  name: "AppHeader",
  components: {
    Menu,
    Search,
    Bell,
    ChevronDown,
    Settings,
    LogOut,
    FileText,
    AlertCircle,
    CheckCircle,
    User,
    Lock,
  },
  emits: ["toggleSidebar", "toggleSearch"],
  data() {
    return {
      pending: false,
      notifications: [
        {
          id: 1,
          title: "Documento atualizado",
          time: "5 min atrás",
          icon: FileText,
          color: "text-primary",
        },
        {
          id: 2,
          title: "Processamento concluído",
          time: "15 min atrás",
          icon: CheckCircle,
          color: "text-success",
        },
        {
          id: 3,
          title: "Atenção necessária",
          time: "1h atrás",
          icon: AlertCircle,
          color: "text-warning",
        },
      ],
      showUserMenu: false,
      showNotificationsMenu: false,
    };
  },
  computed: {
    pageTitle() {
      const titles = {
        Dashboard: "Dashboard",
        Documents: "Documentos",
        Search: "Busca",
        Chat: "Chat IA",
        Upload: "Upload de Documentos",
        Analytics: "Análises",
        Settings: "Configurações",
      };
      return titles[this.$route.name] || "Plataforma de Documentos";
    },
    pageSubtitle() {
      const subtitles = {
        Dashboard: "Visão geral da plataforma",
        Documents: "Gerencie seus documentos",
        Search: "Encontre informações rapidamente",
        Chat: "Converse com IA sobre seus documentos",
        Upload: "Adicione novos documentos",
        Analytics: "Insights e estatísticas",
        Settings: "Configure sua conta",
      };
      return subtitles[this.$route.name];
    },
  },
  methods: {
    onLogoutClick() {
      const { logout } = useLogout(this.$router);
      logout();
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
      this.showNotificationsMenu = false;
    },
    toggleNotificationsMenu() {
      this.showNotificationsMenu = !this.showNotificationsMenu;
      this.showUserMenu = false;
    },
    markAllAsRead() {
      this.notifications = [];
    },
    handleClickOutside(event) {
      if (!event.target.closest(".user-menu-btn, .user-dropdown-menu")) {
        this.showUserMenu = false;
      }
      if (!event.target.closest(".notification-btn, .notifications-dropdown")) {
        this.showNotificationsMenu = false;
      }
    },
  },
  mounted() {
    window.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    window.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 999;
  border-bottom: 1px solid var(--border-color);
}

.search-container {
  width: 300px;
}

.search-box {
  background-color: var(--bg-light) !important;
}

.search-box:focus {
  background-color: white !important;
}

.dropdown-menu {
  border: none;
  min-width: 250px;
}

.dropdown-item {
  padding: var(--spacing-sm) var(--spacing-md);
}

.dropdown-item:hover {
  background-color: var(--bg-light);
}

kbd {
  font-size: 0.7em;
  padding: 0.1em 0.4em;
}

.user-menu-btn {
  background: var(--bg-light);
  border: none;
  border-radius: 2rem;
  padding: 0.25rem 1rem;
  transition: background 0.2s;
}
.user-menu-btn:hover {
  background: var(--border-color);
}
.user-dropdown-menu {
  position: absolute;
  right: 0;
  top: 48px;
  min-width: 220px;
  background: var(--bg-light);
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
}
.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem 0.5rem 1rem;
}
.user-dropdown-item {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: var(--text-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}
.user-dropdown-item:hover {
  background: var(--border-color);
  color: var(--primary-color);
}
.notifications-dropdown {
  position: absolute;
  right: 0;
  top: 48px;
  min-width: 400px;
  background: var(--bg-light);
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  padding: 0.5rem 0 0 0;
  display: flex;
  flex-direction: column;
}
.notifications-header {
  border-bottom: 1px solid var(--border-color);
}
.notifications-list {
  max-height: 260px;
  overflow-y: auto;
}
.notification-item {
  background: var(--bg-light);
  transition: background 0.2s;
  cursor: pointer;
  border: none;
  margin-bottom: 0.5rem;
  padding: 1rem 1.2rem;
}
.notification-item.unread {
  background: #f6f8fa;
  border: none;
}
.notification-icon {
  width: 38px;
  height: 38px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.notifications-footer {
  border-top: 1px solid var(--border-color);
}
.notification-btn {
  background: var(--bg-light);
  border: none;
  border-radius: 50%;
  padding: 0.4rem 0.6rem;
  transition: background 0.2s;
}
.notification-btn:hover {
  background: var(--border-color);
}
</style>

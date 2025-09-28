<template>
  <nav class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Header com Logo -->
    <div class="sidebar-header">
      <div class="brand-section">
        <div class="brand-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" rx="6" fill="white" />
            <path
              d="M6 9h12M6 12h12M6 15h9"
              stroke="#4C6EF5"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <circle cx="16.5" cy="7.5" r="4.5" fill="#4C6EF5" />
            <path
              d="m18.75 9.75 1.5 1.5"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div v-if="!isCollapsed" class="brand-text">
          <h1 class="brand-title">Sigo</h1>
          <p class="brand-subtitle">Gestão de Despesas de Viagem</p>
        </div>
      </div>

      <!-- Toggle Button - Posicionado à direita quando expandido -->
      <button
        v-if="!isCollapsed"
        @click="$emit('toggle')"
        class="toggle-btn"
        title="Recolher menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 12h18M3 6h18M3 18h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <!-- Toggle Button - Posicionado abaixo da logo quando colapsado -->
    <div v-if="isCollapsed" class="toggle-section">
      <button
        @click="$emit('toggle')"
        class="toggle-btn toggle-btn-collapsed"
        title="Expandir menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 12h18M3 6h18M3 18h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <!-- Menu Principal -->
    <div class="sidebar-menu">
      <div class="menu-section">
        <h3 v-if="!isCollapsed" class="menu-title">Navegação</h3>
        <ul class="nav-list">
          <li v-for="item in menuItems" :key="item.name" class="nav-item">
            <router-link
              :to="item.path"
              class="nav-link"
              :class="{ active: $route.name === item.name }"
              :title="isCollapsed ? item.label : ''"
            >
              <div class="nav-icon">
                <component :is="item.icon" :size="20" />
              </div>
              <span v-if="!isCollapsed" class="nav-label">{{
                item.label
              }}</span>
              <div v-if="!isCollapsed && item.badge" class="nav-badge">
                {{ item.badge }}
              </div>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Menu Secundário 
      <div class="menu-section">
        <h3 v-if="!isCollapsed" class="menu-title">Ferramentas</h3>
        <ul class="nav-list">
          <li class="nav-item">
            <router-link
              to="/search"
              class="nav-link"
              :class="{ active: $route.name === 'Search' }"
              title="Busca Avançada"
            >
              <div class="nav-icon">
                <Search :size="20" />
              </div>
              <span v-if="!isCollapsed" class="nav-label">Busca</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/upload"
              class="nav-link"
              :class="{ active: $route.name === 'Upload' }"
              title="Upload de Documentos"
            >
              <div class="nav-icon">
                <Upload :size="20" />
              </div>
              <span v-if="!isCollapsed" class="nav-label">Upload</span>
            </router-link>
          </li>
        </ul>
      </div>
      -->
    </div>

    <!-- Footer com Usuário -->
    <div class="sidebar-footer">
      <div class="user-section">
        <div class="user-avatar">
          <img
            :src="userStore.currentUser?.avatar || '/default-avatar.svg'"
            :alt="userStore.currentUser?.name || 'Usuário'"
            class="avatar-img"
          />
          <div class="status-indicator online"></div>
        </div>

        <div v-if="!isCollapsed" class="user-info">
          <h4 class="user-name">
            {{ userStore.currentUser?.name || "Usuário" }}
          </h4>
          <p class="user-role">
            {{ userStore.currentUser?.role || "Administrador" }}
          </p>
        </div>
      </div>

      <!-- Ações do Usuário -->
      <div v-if="!isCollapsed" class="user-actions">
        <button class="action-btn" title="Perfil">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="12"
              cy="7"
              r="4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <button class="action-btn" @click="onLogoutClick" title="Sair">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="16,17 21,12 16,7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- Versão -->
      <div class="version-info">
        <span v-if="!isCollapsed" class="version-text"
          >dev-v{{ appVersion }}</span
        >
        <span v-else class="version-text">v{{ appVersion }}</span>
      </div>
    </div>
  </nav>
</template>

<script>
import { defineComponent } from "vue";
import {
  FileText,
  MessageCircle,
  // Home,
  // Search,
  Upload,
  // BarChart3,
  // Settings,
} from "lucide-vue-next";
import { useUserStore } from "../stores/user";
import pkg from "../../package.json";
import { useLogout } from "../composables/useLogout.js";
export default defineComponent({
  name: "AppSideBar",
  props: {
    isCollapsed: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      pending: false,
      userStore: useUserStore(),
      appVersion: import.meta.env.VITE_VUE_APP_VERSION || `dev-${pkg.version}`,
    };
  },

  methods: {
    onLogoutClick() {
      const { logout } = useLogout(this.$router);
      logout();
    },
  },

  computed: {
    menuItems() {
      return [
        {
          name: "Chat",
          label: "Chat IA",
          path: "/chat",
          icon: MessageCircle,
          badge: null,
        },
        {
          name: "Documents",
          label: "Documentos",
          path: "/reports",
          icon: FileText,
          badge: "Em desenvolvimento",
        },

        {
          name: "Upload",
          label: "Upload",
          path: "/upload",
          icon: Upload,
          badge: "Em desenvolvimento",
        },
      ];
    },
  },
});
</script>

<style scoped>
.sidebar {
  width: 280px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 80px;
}

/* Header */
.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 1rem 0.5rem;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.brand-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(76, 110, 245, 0.3);
}

.brand-text {
  overflow: hidden;
  white-space: nowrap;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 500;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

.toggle-section {
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-btn-collapsed {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-btn-collapsed:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(76, 110, 245, 0.3);
}

/* Menu */
.sidebar-menu {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.menu-section {
  margin-bottom: 2rem;
}

.menu-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 1rem 0.75rem 1rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0.25rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, rgba(76, 110, 245, 0.2), transparent);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
}

.nav-link:hover::before {
  width: 100%;
}

.nav-link.active {
  color: white;
  background: linear-gradient(
    90deg,
    rgba(76, 110, 245, 0.2),
    rgba(76, 110, 245, 0.1)
  );
  border-left: 3px solid #4c6ef5;
}

.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-badge {
  background: #4c6ef5;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

/* Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #1a1a2e;
}

.status-indicator.online {
  background: #10b981;
}

.user-info {
  flex: 1;
  overflow: hidden;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

.version-info {
  text-align: center;
}

.version-text {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}

.version-dot {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Responsividade */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.show {
    transform: translateX(0);
  }
}

/* Scrollbar personalizada */
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Animações */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-item {
  animation: fadeIn 0.3s ease forwards;
}

.nav-item:nth-child(1) {
  animation-delay: 0.1s;
}
.nav-item:nth-child(2) {
  animation-delay: 0.2s;
}
.nav-item:nth-child(3) {
  animation-delay: 0.3s;
}
.nav-item:nth-child(4) {
  animation-delay: 0.4s;
}
</style>

<template>
  <div id="app">
    <AppSidebar :is-collapsed="isSidebarCollapsed" @toggle="toggleSidebar" />

    <div
      class="main-content"
      :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
    >
      <AppHeader
        @toggle-sidebar="toggleSidebar"
        @toggle-search="toggleSearchModal"
      />

      <main class="content-area">
        <router-view />
      </main>
    </div>

    <!-- Global Search Modal -->
    <SearchModal v-model="showSearchModal" />
    <!-- Notifications -->
    <NotificationToast />
    <!-- Global Loading Overlay -->
    <GlobalLoadingOverlay />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useWindowSize } from "@vueuse/core";
//@ts-ignore
import AppSidebar from "./AppSidebar.vue";
//@ts-ignore
import AppHeader from "./AppHeader.vue";
import SearchModal from "../components/search/SearchModal.vue";
//@ts-ignore
import NotificationToast from "../components/common/NotificationToast.vue";
//@ts-ignore
import GlobalLoadingOverlay from "../components/common/GlobalLoadingOverlay.vue";

const isSidebarCollapsed = ref(false);
const showSearchModal = ref(false);
const { width } = useWindowSize();

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleSearchModal = () => {
  showSearchModal.value = !showSearchModal.value;
};

onMounted(() => {
  // Auto-collapse sidebar on mobile
  if (width.value < 768) {
    isSidebarCollapsed.value = true;
  }
});
</script>

<style scoped>
.main-content {
  margin-left: 280px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

.content-area {
  padding: var(--spacing-lg);
  background-color: var(--bg-light);
  min-height: calc(100vh - 70px);
}

@media (max-width: 768px) {
  .main-content,
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}
</style>

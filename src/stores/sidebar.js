import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        isSidebarOpen: false,
        isCollapsed: false,
        selected: useStorage('selected', 'eCommerce'),
        page: useStorage('page', 'Dashboard')
    }),
    actions: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
        }
    }
});
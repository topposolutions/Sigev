import { defineStore } from 'pinia';

export const useHtmlClassStore = defineStore('htmlclass', {
  state: () => ({
    isLoading: false,
    isLoadingText: "",
  }),

  getters: {
    getIsLoading: (state) => state.isLoading,
    getIsLoadingText: (state) => state.isLoadingText,
  },

  actions: {
    startLoading() {
      this.isLoading = true;
    },

    stopLoading() {
      this.isLoading = false;
    },

    startLoadingText(text) {
      this.isLoading = true;
      this.isLoadingText = text;
    },

    stopLoadingText() {
      this.isLoading = false;
      this.isLoadingText = "";
    },
  },
}); 
import { defineStore } from 'pinia';
import Swal from "sweetalert2";

// action types (mantidos para compatibilidade)
export const ADD_BODY_CLASSNAME = "addBodyClassName";
export const REMOVE_BODY_CLASSNAME = "removeBodyClassName";
export const ADD_CLASSNAME = "addClassName";
export const WARNING = "warning";
export const ERROR = "error";
export const START_LOADING = "startLoading";
export const STOP_LOADING = "stopLoading";
export const START_LOADING_TEXT = "startLoadingText";
export const STOP_LOADING_TEXT = "stopLoadingText";
export const SET_LOADING_STATE = "setLoadingState";
export const SET_LOADING_STATE_TEXT = "setLoadingStateText";
export const SHOW_MODAL_SENHA = "showModalSenha";
export const SHOW_MODAL_PERFIL = "showModalPerfil";
export const SET_SHOW_MODAL_SENHA = "setShowModalSenha";
export const SET_SHOW_MODAL_PERFIL = "setShowModalPerfil";

export const useHtmlClassStore = defineStore('htmlclass', {
  state: () => ({
    classes: {},
    isLoading: false,
    isLoadingText: "",
    showModalSenha: false,
    showModalPerfil: false,
  }),

  getters: {
    getClasses: (state) => (position) => {
      if (typeof position !== "undefined") {
        return state.classes[position];
      }
      return state.classes;
    },
    getIsLoading: (state) => {
      return state.isLoading;
    },
    getIsLoadingText: (state) => {
      return state.isLoadingText;
    },
    getShowModalSenha: (state) => {
      return state.showModalSenha;
    },
    getShowModalPerfil: (state) => {
      return state.showModalPerfil;
    },
  },

  actions: {
    warning(text) {
      Swal.fire({
        title: "Atenção!", //this.$t("COMMON.WARNING_TITLE"),
        text,
        icon: "warning",
      });
    },

    error(text) {
      Swal.fire({
        title: "Erro!", //this.$t("COMMON.ERROR_TITLE"),
        text,
        icon: "warning",
      });
    },

    showModalSenha() {
      this.showModalSenha = true;
    },

    showModalPerfil() {
      this.showModalPerfil = true;
    },

    addBodyClassName(className) {
      document.body.classList.add(className);
    },

    removeBodyClassName(className) {
      document.body.classList.remove(className);
    },

    addClassName(payload) {
      const { position, className } = payload;
      if (!this.classes[position]) {
        this.classes[position] = [];
      }
      this.classes[position].push(className);
    },

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
      this.isLoadingText = null;
    },

    // Métodos de compatibilidade para manter a API antiga
    [WARNING](text) {
      this.warning(text);
    },

    [ERROR](text) {
      this.error(text);
    },

    [SHOW_MODAL_SENHA]() {
      this.showModalSenha = true;
    },

    [SHOW_MODAL_PERFIL]() {
      this.showModalPerfil = true;
    },

    [ADD_BODY_CLASSNAME](className) {
      document.body.classList.add(className);
    },

    [REMOVE_BODY_CLASSNAME](className) {
      document.body.classList.remove(className);
    },

    [ADD_CLASSNAME](payload) {
      const { position, className } = payload;
      if (!this.classes[position]) {
        this.classes[position] = [];
      }
      this.classes[position].push(className);
    },

    [START_LOADING]() {
      this.isLoading = true;
    },

    [STOP_LOADING]() {
      this.isLoading = false;
    },

    [START_LOADING_TEXT](text) {
      this.isLoading = true;
      this.isLoadingText = text;
    },

    [STOP_LOADING_TEXT]() {
      this.isLoading = false;
      this.isLoadingText = null;
    },
  },
}); 
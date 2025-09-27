import Swal from "sweetalert2";
// action types
export const ADD_BODY_CLASSNAME = "addBodyClassName";
export const REMOVE_BODY_CLASSNAME = "removeBodyClassName";
export const ADD_CLASSNAME = "addClassName";
// mutation types
export const SET_CLASSNAME_BY_POSITION = "setClassNameByPosition";

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




export default {
  state: {
    classes: {},
    isLoading: false,
    isLoadingText: "",
    showModalSenha: false,
    showModalPerfil: false,
  },
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
    [WARNING](context, text) {
      Swal.fire({
        title: "Atenção!", //this.$t("COMMON.WARNING_TITLE"),
        text,
        icon: "warning",
      });
    },
    [ERROR](context, text) {
      Swal.fire({
        title: "Erro!", //this.$t("COMMON.ERROR_TITLE"),
        text,
        icon: "warning",
      });
    },
    [SHOW_MODAL_SENHA](context) {
      context.commit(SET_SHOW_MODAL_SENHA, true);
    },
    [SHOW_MODAL_PERFIL](context) {
      context.commit(SET_SHOW_MODAL_PERFIL, true);
    },
    [ADD_BODY_CLASSNAME](context, className) {
      document.body.classList.add(className);
    },
    [REMOVE_BODY_CLASSNAME](context, className) {
      document.body.classList.remove(className);
    },
    [ADD_CLASSNAME](context, payload) {
      context.commit(SET_CLASSNAME_BY_POSITION, payload);
    },
    [START_LOADING](context) {
      context.commit(SET_LOADING_STATE, true);
    },
    [STOP_LOADING](context) {
      context.commit(SET_LOADING_STATE, false);
    },
    [START_LOADING_TEXT](context, text) {      
      context.commit(SET_LOADING_STATE_TEXT, {isLoading: true, text});
    },
    [STOP_LOADING_TEXT](context) {
      context.commit(SET_LOADING_STATE_TEXT, {isLoading: false, text: null});
    },
  },
  mutations: {
    [SET_CLASSNAME_BY_POSITION](state, payload) {
      const { position, className } = payload;
      if (!state.classes[position]) {
        state.classes[position] = [];
      }
      state.classes[position].push(className);
    },
    [SET_LOADING_STATE](state, loading) {
      state.isLoading = loading;
    },
    [SET_LOADING_STATE_TEXT](state, payload) {
      state.isLoading = payload.isLoading;
      state.isLoadingText = payload.text;
    },
    [SET_SHOW_MODAL_SENHA](state) {
      state.showModalSenha = !state.showModalSenha;
    },
    [SET_SHOW_MODAL_PERFIL](state) {
      state.showModalPerfil = !state.showModalPerfil;
    },
  },
};

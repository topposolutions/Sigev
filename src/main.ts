import { createApp } from "vue";
import { createPinia } from "pinia";
import BootstrapVueNext from "bootstrap-vue-next";
import router from "./router";
import App from "./App.vue";
//@ts-ignore
import i18n from "./common/plugins/vue-i18n";
//@ts-ignore
import { useAuthStore } from "./stores/auth.store";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "./styles/main.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import "primeicons/primeicons.css";

String.prototype.formatUnicorn =
  String.prototype.formatUnicorn ||
  function () {
    "use strict";
    //@ts-ignore
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args =
        "string" === t || "number" === t
          ? Array.prototype.slice.call(arguments)
          : arguments[0];

      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }

    return str;
  };

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(BootstrapVueNext);

// Inicializa a verificação de autenticação
/**
 * const authStore = useAuthStore();
authStore.verifyAuth().then((isAuthenticated: boolean) => {
    console.log('Inicialização - Usuário autenticado:', isAuthenticated);
});
 * 
 */

app.mount("#app");

 

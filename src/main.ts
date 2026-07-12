import { createApp } from "vue";

import App from "./App.vue";

import router from "./router";

import { createPinia } from "pinia";

import vue3GoogleLogin from "vue3-google-login";

// ================= VUETIFY =================
import vuetify from "./plugins/vuetify";

// ================= STYLE =================
import "vuetify/styles";

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.use(vuetify);

app.use(vue3GoogleLogin, {

  clientId:
    "288306900403-nilg3lo8kerodbk2n283sk48oajg2hkt.apps.googleusercontent.com",

});

app.mount("#app");
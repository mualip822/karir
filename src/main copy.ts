import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// ================= VUETIFY =================
import "vuetify/styles";
import vuetify from "./plugins/vuetify";

// ================= ICON =================
import "@mdi/font/css/materialdesignicons.css";

// ================= FONT =================
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

// ================= GLOBAL STYLE =================
import "./style.css";

// ================= GOOGLE LOGIN =================
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.use(vuetify);

app.use(vue3GoogleLogin, {
  clientId:
    "288306900403-nilg3lo8kerodbk2n283sk48oajg2hkt.apps.googleusercontent.com",
});

app.mount("#app");
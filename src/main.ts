import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"

import vue3GoogleLogin from "vue3-google-login"

// ================= VUETIFY =================
import vuetify from "./plugins/vuetify"

// ================= STYLE =================
import "vuetify/styles"

// ================= AUTH =================
import { useAuthStore } from "./auth/stores/useAuthStore"


// ======================================================
// CREATE APP
// ======================================================
const app = createApp(App)


// ======================================================
// PINIA
// ======================================================
const pinia = createPinia()

app.use(pinia)


// ======================================================
// RESTORE AUTH
// ======================================================
// PENTING:
// Harus dilakukan setelah Pinia dipasang,
// tetapi SEBELUM app.mount()
//
// Dengan ini ketika browser di-refresh:
// localStorage token -> authStore.token
// ======================================================
const authStore = useAuthStore()

authStore.initAuth()


// ======================================================
// ROUTER
// ======================================================
app.use(router)


// ======================================================
// VUETIFY
// ======================================================
app.use(vuetify)


// ======================================================
// GOOGLE LOGIN
// ======================================================
app.use(vue3GoogleLogin, {
  clientId:
    "288306900403-nilg3lo8kerodbk2n283sk48oajg2hkt.apps.googleusercontent.com",
})


// ======================================================
// MOUNT APP
// ======================================================
app.mount("#app")
<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    width="270"
    :rail="collapsed"
    class="app-drawer"
  >
    <!-- HEADER dengan LOGO + ICON -->
    <div class="pa-4 d-flex justify-space-between align-center">
      <div v-if="!collapsed" class="d-flex align-center">
        <v-icon class="logo-icon" color="#1E293B" size="28">mdi-briefcase</v-icon>
        <span class="logo-text ml-2">
          {{ logoText }}
        </span>
      </div>

      <v-btn icon variant="text" @click="toggleCollapse" class="collapse-btn">
        <v-icon color="#64748B">mdi-menu</v-icon>
      </v-btn>
    </div>

    <v-divider class="divider" />

    <!-- MENU (dari prop) -->
    <v-list nav density="comfortable" v-model:opened="opened">
      <template v-for="item in menu" :key="item.title">
        <!-- Menu tanpa child -->
        <v-list-item
          v-if="!item.children || item.children.length === 0"
          :to="item.to"
          :prepend-icon="item.icon"
          rounded="xl"
          class="my-2 menu-item"
          :active="isActive(item.to)"
          active-class="active-menu"
        >
          <v-list-item-title v-if="!collapsed">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>

        <!-- Menu dengan child (dropdown) -->
        <v-list-group v-else :value="item.title">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="item.icon"
              rounded="xl"
              class="my-2 menu-item"
            >
              <v-list-item-title v-if="!collapsed">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            :to="child.to"
            rounded="xl"
            class="ml-6 my-1 sub-menu-item"
            :active="isActive(child.to)"
            active-class="active-menu"
          >
            <v-list-item-title v-if="!collapsed">
              {{ child.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </template>

      <!-- ========== MENU LOGOUT (TETAP / HARDCODED) ========== -->
      <v-list-item
        :prepend-icon="'mdi-logout'"
        rounded="xl"
        class="my-2 menu-item logout-item"
        @click="handleLogout"
      >
        <v-list-item-title v-if="!collapsed">
          Logout
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const drawer = ref(true)
const collapsed = ref(false)
const opened = ref([])

const route = useRoute()
const router = useRouter()

const props = defineProps({
  menu: { type: Array, required: true },
  logoText: { type: String, default: "Pelan" },
})

const menu = computed(() => props.menu)
const logoText = computed(() => props.logoText)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  if (collapsed.value) opened.value = []
}

const isActive = (path) => {
  if (!path) return false
  return route.path.startsWith(path)
}

const setOpenedMenu = () => {
  const foundMenu = menu.value.find(item =>
    item.children?.some(child => route.path.startsWith(child.to))
  )
  if (foundMenu) opened.value = [foundMenu.title]
}

// Handler logout
const handleLogout = () => {
  localStorage.removeItem("token")
  router.push("/")
}

onMounted(setOpenedMenu)
watch(() => route.path, setOpenedMenu)

// Accordion mode
watch(opened, (val) => {
  if (val.length > 1) opened.value = [val[val.length - 1]]
})
</script>

<style scoped>
.app-drawer {
  background: #FFFFFF;
  border-right: 1px solid #E2E8F0;
  color: #1E293B;
}

.logo-icon {
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.05));
}

.logo-text {
  font-weight: 700;
  font-size: 18px;
  color: #0F172A;
  letter-spacing: -0.3px;
}

.divider {
  opacity: 0.6;
  border-color: #E2E8F0;
  margin: 0 16px;
}

.menu-item {
  color: #475569 !important;
  transition: all 0.2s ease;
  border-radius: 12px;
  cursor: pointer;
  margin: 4px 12px;
}

.menu-item:hover {
  background: #F1F5F9;
  transform: translateX(3px);
  color: #0F172A !important;
}

.sub-menu-item {
  color: #64748B !important;
  font-size: 14px;
  border-radius: 10px;
  transition: 0.2s;
}

.sub-menu-item:hover {
  background: #F1F5F9;
  transform: translateX(3px);
  color: #0F172A !important;
}

.active-menu {
  background: #EFF6FF !important;
  color: #2563EB !important;
  font-weight: 600;
  box-shadow: none;
}

.active-menu .v-icon {
  color: #2563EB !important;
}

.v-list-item--active .v-icon {
  color: #2563EB !important;
}

.logout-item {
  margin-top: 16px;
  border-top: 1px solid #E2E8F0;
  border-radius: 0;
  padding-top: 12px;
}

/* Ikon pada menu */
.v-list-item__prepend > .v-icon {
  color: #64748B;
  transition: color 0.2s;
}

.menu-item:hover .v-list-item__prepend > .v-icon {
  color: #2563EB;
}

.active-menu .v-list-item__prepend > .v-icon {
  color: #2563EB !important;
}

/* Group header (dropdown) */
.v-list-group__activator > .v-list-item {
  color: #475569 !important;
}

.v-list-group__activator:hover > .v-list-item {
  background: #F1F5F9 !important;
  color: #0F172A !important;
}

/* Saat collapsed (rail) */
.v-navigation-drawer--rail .logo-text,
.v-navigation-drawer--rail .logo-icon {
  display: none;
}

.v-navigation-drawer--rail .menu-item {
  justify-content: center;
  margin: 4px auto;
}

/* Tombol collapse */
.collapse-btn {
  color: #64748B;
}

.collapse-btn:hover {
  background: #F1F5F9;
}
</style>
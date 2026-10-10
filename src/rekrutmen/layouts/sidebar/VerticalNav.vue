<template>
  <!-- ============================================================
       MOBILE MENU TRIGGER (opsional)
       - triggerStyle="pill"   → pill putih compact di kiri atas
       - triggerStyle="hidden" → tidak render (parent handle sendiri)
       Default: hidden — parent (UserLayout) yang handle tombol
  ============================================================ -->
  <button
    v-if="isMobile && !drawer && triggerStyle === 'pill'"
    class="mobile-menu-trigger"
    type="button"
    aria-label="Buka menu"
    @click="openDrawer"
  >
    <svg viewBox="0 0 24 24" fill="none" class="mobile-trigger-icon">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
    <span class="mobile-trigger-label">Menu</span>
  </button>

  <!-- ============================================================
       SIDEBAR
  ============================================================ -->
  <v-navigation-drawer
    v-model="drawer"
    app
    :permanent="!isMobile"
    :temporary="isMobile"
    :width="sidebarWidth"
    :rail="!isMobile && collapsed"
    :class="['app-drawer', { 'app-drawer-mobile': isMobile }]"
  >
    <!-- HEADER -->
    <div
      class="drawer-header"
      :class="{ 'drawer-header-collapsed': collapsed && !isMobile }"
    >
      <div v-if="!collapsed || isMobile" class="header-brand">
        <div class="header-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" class="header-icon">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5" />
            <path d="M8 12h8M8 8h8M8 16h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>

        <div class="header-text">
          <span class="header-title">{{ logoText }}</span>
          <span class="header-subtitle">Enterprise ATS Platform</span>
        </div>
      </div>

      <!-- Close di mobile / Collapse di desktop -->
      <button
        class="menu-toggle-btn"
        type="button"
        :aria-label="
          isMobile
            ? 'Tutup menu'
            : collapsed
              ? 'Buka sidebar'
              : 'Kecilkan sidebar'
        "
        @click="toggleCollapse"
      >
        <!-- Close X untuk mobile -->
        <svg
          v-if="isMobile"
          viewBox="0 0 24 24"
          fill="none"
          class="hamburger-icon"
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <!-- Garis 3 untuk desktop (collapse) -->
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          class="hamburger-icon"
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <div class="drawer-divider"></div>

    <!-- NAVIGATION -->
    <nav class="nav-container">
      <template v-for="item in menu" :key="item.title">
        <!-- SINGLE ITEM -->
        <div
          v-if="!item.children || item.children.length === 0"
          class="nav-item-wrapper"
        >
          <router-link
            :to="item.to"
            :class="[
              'nav-item',
              {
                'nav-item-active': isActive(item.to),
                'nav-item-collapsed': collapsed && !isMobile,
              },
            ]"
            :title="collapsed && !isMobile ? item.title : ''"
            @click="handleMobileNav"
          >
            <div
              class="nav-icon-box"
              :class="{ 'nav-icon-active': isActive(item.to) }"
            >
              <v-icon size="20" class="nav-icon">{{ item.icon }}</v-icon>
            </div>

            <span v-if="!collapsed || isMobile" class="nav-label">
              {{ item.title }}
            </span>
          </router-link>
        </div>

        <!-- GROUP -->
        <div v-else class="nav-group-wrapper">
          <button
            :class="[
              'nav-item',
              'nav-group-trigger',
              { 'nav-item-collapsed': collapsed && !isMobile },
            ]"
            type="button"
            :title="collapsed && !isMobile ? item.title : ''"
            @click="toggleGroup(item.title)"
          >
            <div class="nav-icon-box">
              <v-icon size="20" class="nav-icon">{{ item.icon }}</v-icon>
            </div>

            <span v-if="!collapsed || isMobile" class="nav-label">
              {{ item.title }}
            </span>

            <svg
              v-if="!collapsed || isMobile"
              :class="[
                'expand-icon',
                { 'expand-icon-open': opened.includes(item.title) },
              ]"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M7 8l3 3 3-3"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <transition name="expand">
            <div
              v-if="(!collapsed || isMobile) && opened.includes(item.title)"
              class="nav-children"
            >
              <router-link
                v-for="child in item.children"
                :key="child.title"
                :to="child.to"
                :class="[
                  'nav-item',
                  'nav-child',
                  { 'nav-child-active': isActive(child.to) },
                ]"
                @click="handleMobileNav"
              >
                <span class="nav-child-line"></span>
                <span class="nav-child-label">{{ child.title }}</span>
              </router-link>
            </div>
          </transition>
        </div>
      </template>
    </nav>

    <!-- LOGOUT -->
    <div
      class="logout-section"
      :class="{ 'logout-collapsed': collapsed && !isMobile }"
    >
      <div class="drawer-divider"></div>

      <button
        class="nav-item logout-button"
        :class="{ 'nav-item-collapsed': collapsed && !isMobile }"
        type="button"
        :title="collapsed && !isMobile ? 'Keluar' : ''"
        @click="handleLogout"
      >
        <div class="nav-icon-box logout-icon-box">
          <svg viewBox="0 0 20 20" fill="none" class="logout-svg">
            <path d="M7 17H4a1 1 0 01-1-1V4a1 1 0 011-1h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M12 14l3-4-3-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15 10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>

        <span v-if="!collapsed || isMobile" class="nav-label logout-label">
          Keluar
        </span>
      </button>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

/* ============================================================
   PROPS
============================================================ */

const props = defineProps({
  menu: { type: Array, required: true },
  logoText: { type: String, default: 'Portal' },
  /*
   * "pill"   → pill putih compact di kiri atas (floating)
   * "hidden" → tidak render — parent handle sendiri (default)
   */
  triggerStyle: {
    type: String,
    default: 'hidden',
    validator: (v) => ['pill', 'hidden'].includes(v),
  },
});

const menu = computed(() => props.menu);
const logoText = computed(() => props.logoText);
const triggerStyle = computed(() => props.triggerStyle);

/* ============================================================
   STATE
============================================================ */

const drawer = ref(false);
const collapsed = ref(false);
const opened = ref([]);
const isMobile = ref(false);

const route = useRoute();
const router = useRouter();

/* ============================================================
   WIDTH
============================================================ */

const sidebarWidth = computed(() => {
  if (isMobile.value) return 280;
  return collapsed.value ? 72 : 280;
});

/* ============================================================
   RESPONSIVE — matchMedia
============================================================ */

const MOBILE_QUERY = '(max-width: 960px)';
let mediaQuery = null;

function applyBreakpoint(matches) {
  const wasMobile = isMobile.value;
  isMobile.value = matches;

  if (wasMobile === matches) return;

  if (matches) {
    collapsed.value = false;
    drawer.value = false;
  } else {
    drawer.value = true;
  }
}

function handleMediaChange(event) {
  applyBreakpoint(event.matches);
}

/* ============================================================
   TOGGLE / OPEN / CLOSE
============================================================ */

function openDrawer() {
  drawer.value = true;
}

function closeDrawer() {
  drawer.value = false;
}

function toggleCollapse() {
  if (isMobile.value) {
    drawer.value = false;
    return;
  }

  collapsed.value = !collapsed.value;
  if (collapsed.value) opened.value = [];
}

/* ============================================================
   GROUP
============================================================ */

function toggleGroup(title) {
  if (opened.value.includes(title)) {
    opened.value = opened.value.filter((t) => t !== title);
  } else {
    opened.value = [title];
  }
}

/* ============================================================
   ACTIVE
============================================================ */

function isActive(path) {
  if (!path) return false;
  return route.path.startsWith(path);
}

function setOpenedMenu() {
  const found = menu.value.find((item) =>
    item.children?.some((child) => route.path.startsWith(child.to)),
  );
  if (found) opened.value = [found.title];
}

/* ============================================================
   MOBILE NAV
============================================================ */

function handleMobileNav() {
  if (isMobile.value) drawer.value = false;
}

/* ============================================================
   LOGOUT
============================================================ */

function handleLogout() {
  localStorage.removeItem('token');
  router.push('/');
}

/* ============================================================
   LIFECYCLE
============================================================ */

onMounted(() => {
  mediaQuery = window.matchMedia(MOBILE_QUERY);

  isMobile.value = mediaQuery.matches;
  if (isMobile.value) {
    collapsed.value = false;
    drawer.value = false;
  } else {
    drawer.value = true;
  }

  mediaQuery.addEventListener('change', handleMediaChange);

  setOpenedMenu();
});

onBeforeUnmount(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleMediaChange);
  }
});

watch(() => route.path, setOpenedMenu);

/* ============================================================
   EXPOSE — parent (UserLayout) bisa buka/tutup drawer
============================================================ */

defineExpose({
  openDrawer,
  closeDrawer,
});
</script>

<style scoped>
/* ============================================================
   GLOBAL FONT
============================================================ */

.app-drawer {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, sans-serif;
  letter-spacing: -0.01em;
}

/* ============================================================
   DRAWER BASE
============================================================ */

.app-drawer {
  background: #10254b;
  border-right: none;
  color: #ffffff;
  overflow: hidden;
  transition: width 0.25s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.app-drawer:not(.app-drawer-mobile) {
  border-radius: 0 20px 20px 0;
}

/* ============================================================
   HEADER
============================================================ */

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 20px 16px;
  min-height: 76px;
  background: #172f5c;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-header-collapsed {
  justify-content: center;
  padding: 16px 0;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.header-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #2f6bff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.header-title {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-subtitle {
  font-size: 10px;
  font-weight: 500;
  color: #a7b4c8;
  line-height: 1;
  white-space: nowrap;
}

/* ============================================================
   MENU TOGGLE (di header drawer)
============================================================ */

.menu-toggle-btn {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: #a7b4c8;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.menu-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.hamburger-icon {
  width: 20px;
  height: 20px;
}

/* ============================================================
   DIVIDER
============================================================ */

.drawer-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 16px;
}

/* ============================================================
   NAV
============================================================ */

.nav-container {
  padding: 12px 8px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 48px;
  padding: 0 12px;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #a7b4c8;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
  position: relative;
  font-family: inherit;
  text-align: left;
  margin-bottom: 2px;
  -webkit-tap-highlight-color: transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e5e7eb;
}

.nav-item:hover .nav-icon {
  color: #e5e7eb;
}

.nav-item-collapsed {
  justify-content: center;
  padding: 0;
  width: 48px;
  height: 48px;
  margin: 0 auto;
}

.nav-item-active {
  background: #2f6bff;
  color: #ffffff;
}

.nav-item-active:hover {
  background: #2457d6;
  color: #ffffff;
}

/* ============================================================
   ICON BOX
============================================================ */

.nav-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s ease;
}

.nav-icon-active {
  background: rgba(255, 255, 255, 0.15);
}

.nav-icon {
  color: #a7b4c8;
  transition: color 0.15s ease;
}

.nav-item-active .nav-icon {
  color: #ffffff;
}

/* ============================================================
   LABEL
============================================================ */

.nav-label {
  font-size: 13px;
  font-weight: 600;
  color: inherit;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
  letter-spacing: -0.01em;
}

/* ============================================================
   GROUP
============================================================ */

.nav-group-trigger {
  margin-bottom: 0;
}

.expand-icon {
  width: 16px;
  height: 16px;
  color: #a7b4c8;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.expand-icon-open {
  transform: rotate(180deg);
}

/* ============================================================
   CHILDREN
============================================================ */

.nav-children {
  position: relative;
  margin-left: 18px;
  padding-left: 22px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.nav-child {
  height: 40px;
  padding: 0 12px 0 0;
  gap: 8px;
  color: #a7b4c8;
  font-weight: 500;
}

.nav-child:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e5e7eb;
}

.nav-child-line {
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.15s ease;
}

.nav-child-active .nav-child-line {
  background: #2f6bff;
}

.nav-child-active {
  color: #ffffff;
  font-weight: 600;
}

.nav-child-label {
  font-size: 12.5px;
  margin-left: 8px;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.22s ease;
  max-height: 500px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* ============================================================
   LOGOUT
============================================================ */

.logout-section {
  padding-bottom: 16px;
  margin-top: auto;
}

.logout-section .drawer-divider {
  margin-bottom: 12px;
}

.logout-collapsed {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logout-button {
  margin: 0 8px;
  width: calc(100% - 16px);
  height: 46px;
  border-radius: 12px;
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
}

.logout-button:hover .nav-icon-box {
  background: rgba(239, 68, 68, 0.15);
}

.logout-icon-box {
  background: rgba(255, 255, 255, 0.05);
}

.logout-svg {
  width: 18px;
  height: 18px;
  color: #a7b4c8;
  transition: color 0.15s ease;
}

.logout-button:hover .logout-svg,
.logout-button:hover .logout-label {
  color: #fca5a5;
}

/* ============================================================
   MOBILE MENU TRIGGER — hanya dirender kalau triggerStyle="pill"
============================================================ */

.mobile-menu-trigger {
  position: fixed;
  top: 14px;
  left: 14px;
  z-index: 2000;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  height: 40px;
  padding: 0 14px 0 12px;

  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #ffffff;

  color: #0f172a;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.005em;

  cursor: pointer;

  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px -4px rgba(15, 23, 42, 0.08);

  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  -webkit-tap-highlight-color: transparent;
}

.mobile-menu-trigger:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.06),
    0 6px 16px -4px rgba(15, 23, 42, 0.12);
}

.mobile-menu-trigger:active {
  transform: scale(0.97);
  background: #f1f5f9;
}

.mobile-trigger-icon {
  width: 18px;
  height: 18px;
  color: #475569;
  flex-shrink: 0;
}

.mobile-trigger-label {
  color: #0f172a;
  line-height: 1;
}

/* ============================================================
   MOBILE DRAWER OVERRIDES
============================================================ */

@media (max-width: 960px) {
  .app-drawer {
    max-width: 85vw;
    border-radius: 0 20px 20px 0;
  }

  .drawer-header {
    padding: 18px 16px;
    min-height: 72px;
  }

  .nav-item {
    height: 52px;
  }

  .nav-icon-box {
    width: 38px;
    height: 38px;
  }
}

@media (max-width: 600px) {
  .header-subtitle {
    display: none;
  }

  .header-title {
    font-size: 14px;
  }

  .mobile-menu-trigger {
    top: 12px;
    left: 12px;
    height: 38px;
    padding: 0 12px 0 10px;
  }

  .mobile-trigger-icon {
    width: 16px;
    height: 16px;
  }

  .mobile-trigger-label {
    font-size: 12.5px;
  }
}

/* ============================================================
   SCROLLBAR
============================================================ */

.nav-container::-webkit-scrollbar {
  width: 4px;
}

.nav-container::-webkit-scrollbar-track {
  background: transparent;
}

.nav-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.nav-container:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.22);
}

/* ============================================================
   REDUCED MOTION
============================================================ */

@media (prefers-reduced-motion: reduce) {
  .app-drawer,
  .mobile-menu-trigger,
  .expand-enter-active,
  .expand-leave-active,
  .expand-icon {
    transition: none !important;
  }
}

/* ============================================================
   PRINT
============================================================ */

@media print {
  .app-drawer,
  .mobile-menu-trigger {
    display: none !important;
  }
}
</style>
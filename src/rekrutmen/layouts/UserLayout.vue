<template>
  <v-app class="app-layout" :class="{ 'is-fullscreen-mode': isFullscreen }">

    <!-- ============================================================
         SIDEBAR — sembunyi saat fullscreen mode
    ============================================================= -->
    <VerticalNav
      v-show="!isFullscreen"
      ref="verticalNavRef"
      :menu="menu"
      :logo-text="logoText"
      trigger-style="hidden"
    />

    <!-- ============================================================
         MAIN
    ============================================================= -->
    <v-main class="main-wrapper">

      <!-- ==========================================================
           TOPBAR — sembunyi saat fullscreen mode
      =========================================================== -->
      <header v-show="!isFullscreen" class="topbar">

        <!-- LEFT -->
        <div class="topbar-left">

          <button
            class="mobile-menu"
            type="button"
            aria-label="Buka menu"
            @click="handleMobileMenu"
          >
            <v-icon size="22">mdi-menu</v-icon>
          </button>

          <div class="title-wrapper">
            <h2 class="page-title">Portal Pelamar</h2>
            <p class="page-subtitle">Temukan peluang karir terbaik</p>
          </div>

        </div>

        <!-- RIGHT -->
        <div class="topbar-right">

          <div class="search-box">
            <v-icon size="18">mdi-magnify</v-icon>
            <input
              type="text"
              placeholder="Cari lowongan..."
              autocomplete="off"
            />
          </div>

          <!-- NOTIF DROPDOWN -->
          <div ref="notifRef" class="notif-wrap">
            <button
              class="icon-btn notification-btn"
              type="button"
              :aria-label="`Notifikasi — ${unreadCount} pesan belum dibaca`"
              :aria-expanded="notifOpen"
              @click="toggleNotif"
            >
              <v-icon size="21">mdi-bell-outline</v-icon>

              <span v-if="unreadCount > 0" class="notif-badge" aria-hidden="true">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <Transition name="notif">
              <div v-if="notifOpen" class="notif-dropdown" role="dialog" aria-label="Daftar notifikasi">
                <header class="notif-head">
                  <div class="notif-head-main">
                    <span class="notif-title">Notifikasi</span>
                    <span class="notif-sub">
                      {{ unreadCount > 0 ? `${unreadCount} pesan baru` : 'Semua sudah dibaca' }}
                    </span>
                  </div>

                  <button
                    v-if="unreadCount > 0"
                    type="button"
                    class="notif-action"
                    @click="markAllAsRead"
                  >
                    Tandai semua
                  </button>
                </header>

                <div class="notif-body">
                  <div v-if="messageStore.loading" class="notif-loading">
                    <span class="notif-spinner"></span>
                    <span>Memuat pesan…</span>
                  </div>

                  <div
                    v-else-if="messageStore.recentMessages.length === 0"
                    class="notif-empty"
                  >
                    <v-icon size="28" color="#8b95a5">mdi-bell-sleep-outline</v-icon>
                    <strong>Belum ada notifikasi</strong>
                    <span>Pesan dari rekruter akan muncul di sini (hanya 24 jam terakhir).</span>
                  </div>

                  <ul v-else class="notif-list">
                    <li
                      v-for="msg in messageStore.recentMessages.slice(0, 6)"
                      :key="msg.id"
                      class="notif-item"
                      :class="{ 'is-unread': !msg.is_read }"
                      @click="openMessage(msg)"
                    >
                      <div class="notif-avatar" aria-hidden="true">
                        {{ initials(msg) }}
                      </div>

                      <div class="notif-body-text">
                        <div class="notif-item-top">
                          <span class="notif-item-title">{{ msg.subject }}</span>
                          <span class="notif-item-time">{{ shortTime(msg.created_at) }}</span>
                        </div>
                        <p class="notif-item-preview">{{ preview(msg.body) }}</p>
                      </div>

                      <span v-if="!msg.is_read" class="notif-item-dot" aria-hidden="true"></span>
                    </li>
                  </ul>
                </div>

                <footer v-if="messageStore.recentMessages.length > 0" class="notif-foot">
                  <router-link
                    :to="{ name: 'user-pesan' }"
                    class="notif-foot-link"
                    @click="closeNotif"
                  >
                    <span>Lihat semua pesan</span>
                    <v-icon size="14">mdi-arrow-right</v-icon>
                  </router-link>
                </footer>
              </div>
            </Transition>
          </div>

          <!-- USER -->
          <div class="user-box">
            <v-avatar size="40" class="user-avatar">
              <span class="avatar-text">{{ userInitial }}</span>
            </v-avatar>

            <div class="user-info">
              <strong>{{ userName }}</strong>
              <span>{{ userRole }}</span>
            </div>
          </div>

        </div>

      </header>

      <!-- ==========================================================
           PAGE
      =========================================================== -->
      <div
        class="page-container"
        :class="{ 'page-container--fullscreen': isFullscreen }"
      >
        <router-view />
      </div>

    </v-main>

  </v-app>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/stores/useAuthStore';
import { useMessageStore } from '../stores/useMessageStore';
import VerticalNav from './sidebar/VerticalNav.vue';
import { rekrutmenUserMenu } from '../menu/rekrutmen.menu';
import type { RekrutmenMenuItem } from '../menu/rekrutmen.menu';
import type { Message } from '../types/message.types';
import settingsService from '../../modules/settings/services/settingsService';

/* ================================================================
   AUTH + ROUTER + STORE
================================================================ */
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const messageStore = useMessageStore();

/* ================================================================
   REFS
================================================================ */
const verticalNavRef = ref<InstanceType<typeof VerticalNav> | null>(null);
const notifRef = ref<HTMLElement | null>(null);

/* ================================================================
   STATE
================================================================ */
const menu = ref<RekrutmenMenuItem[]>([]);
const employeeAccessLoading = ref(false);
const notifOpen = ref(false);

/* ================================================================
   FULLSCREEN MODE — baca dari route meta
================================================================ */
const isFullscreen = computed(() => {
  return Boolean(route.meta?.fullscreen);
});

/* ================================================================
   COMPUTED
================================================================ */
const unreadCount = computed(() => messageStore.unreadCount);
const logoText = computed(() => 'Portal Pelamar');

const userName = computed(() => {
  const user = authStore.user as any;
  return (
    user?.name ||
    user?.nama ||
    user?.full_name ||
    user?.fullName ||
    'User'
  );
});

const userRole = computed(() => {
  const user = authStore.user as any;
  const role =
    user?.role_name ||
    user?.roleName ||
    user?.role ||
    user?.role?.name;

  if (!role) return 'Pelamar';

  const normalized = String(role).toLowerCase();

  if (
    normalized === 'user' ||
    normalized === 'pelamar' ||
    normalized === 'candidate' ||
    normalized === 'kandidat'
  ) {
    return 'Pelamar';
  }

  return String(role);
});

const userInitial = computed(() => {
  const name = String(userName.value || 'U').trim();
  if (!name) return 'U';

  const words = name.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    const first = words[0] ?? '';
    const second = words[1] ?? '';
    return (first.charAt(0) + second.charAt(0)).toUpperCase();
  }

  return name.charAt(0).toUpperCase();
});

/* ================================================================
   FILTER MENU — buang "Pesan"
================================================================ */
const filterOutPesan = (items: RekrutmenMenuItem[]): RekrutmenMenuItem[] => {
  const isPesan = (item: RekrutmenMenuItem): boolean => {
    const t = String(item.title || '').toLowerCase().trim();
    const to = String(item.to || '').toLowerCase().trim();

    return (
      t === 'pesan' ||
      t === 'messages' ||
      t === 'message' ||
      to === '/user/pesan' ||
      to === '/user/messages'
    );
  };

  return items
    .filter((item) => !isPesan(item))
    .map((item) => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        return {
          ...item,
          children: item.children.filter((child) => !isPesan(child)),
        };
      }
      return item;
    });
};

/* ================================================================
   NOTIF HELPERS
================================================================ */
const initials = (msg: Message): string => {
  const text = (msg.subject || 'P').trim();
  return text.slice(0, 2).toUpperCase() || 'P';
};

const preview = (text: string): string => {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 80 ? clean.slice(0, 80) + '…' : clean;
};

const shortTime = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'baru';
  if (diffMin < 60) return `${diffMin}m`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}j`;

  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
};

/* ================================================================
   NOTIF ACTIONS
================================================================ */
const toggleNotif = (): void => {
  notifOpen.value = !notifOpen.value;

  if (notifOpen.value) {
    messageStore.fetchMessages();
  }
};

const closeNotif = (): void => {
  notifOpen.value = false;
};

const openMessage = async (msg: Message): Promise<void> => {
  if (!msg.is_read) {
    await messageStore.markAsRead(msg.id);
  }

  closeNotif();
  router.push({ name: 'user-pesan' });
};

const markAllAsRead = async (): Promise<void> => {
  const unread = messageStore.recentMessages.filter((m) => !m.is_read);

  for (const m of unread) {
    try {
      await messageStore.markAsRead(m.id);
    } catch {
      /* silent */
    }
  }
};

/* ================================================================
   CLICK OUTSIDE
================================================================ */
const handleClickOutside = (event: MouseEvent): void => {
  const target = event.target as Node;

  if (notifRef.value && !notifRef.value.contains(target)) {
    closeNotif();
  }
};

/* ================================================================
   LOAD MENU
================================================================ */
const loadMenu = async (): Promise<void> => {
  try {
    employeeAccessLoading.value = true;

    const response = await settingsService.getMenu();

    let source: RekrutmenMenuItem[] = [];

    if (
      response &&
      response.success &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      source = response.data as RekrutmenMenuItem[];
    } else {
      source = [...rekrutmenUserMenu];
    }

    menu.value = filterOutPesan(source);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[USER LAYOUT] Gagal mengambil menu Settings:', error);

    menu.value = filterOutPesan([...rekrutmenUserMenu]);
  } finally {
    employeeAccessLoading.value = false;
  }
};

/* ================================================================
   MOBILE MENU
================================================================ */
const handleMobileMenu = (): void => {
  verticalNavRef.value?.openDrawer();
};

/* ================================================================
   MOUNT / UNMOUNT
================================================================ */
onMounted(() => {
  loadMenu();

  messageStore.fetchMessages();
  messageStore.startAutoRefresh();

  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  messageStore.stopAutoRefresh();
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* ================================================================
   FONT
================================================================ */
:global(html),
:global(body),
:global(#app) {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
}

/* ================================================================
   APP
================================================================ */
.app-layout {
  background: #f8fafc;
  min-height: 100vh;
}

/* 🔒 Fullscreen mode: hilangkan sidebar, atur ulang main */
.app-layout.is-fullscreen-mode :deep(.v-navigation-drawer) {
  display: none !important;
}

.app-layout.is-fullscreen-mode :deep(.v-main) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.main-wrapper {
  background: #f8fafc;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

/* ================================================================
   TOPBAR
================================================================ */
.topbar {
  height: 76px;
  width: 100%;
  max-width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 50;
  box-sizing: border-box;
}

/* ================================================================
   LEFT
================================================================ */
.topbar-left {
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
  flex: 1;
}

.title-wrapper { min-width: 0; }

.page-title {
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 18px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ================================================================
   RIGHT
================================================================ */
.topbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

/* SEARCH */
.search-box {
  width: 280px;
  height: 42px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  color: #64748b;
  box-sizing: border-box;
  flex-shrink: 1;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-box:focus-within {
  border-color: #2f6bff;
  box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.1);
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
  min-width: 0;
  font-family: inherit;
  font-size: 14px;
  background: transparent;
  color: #0f172a;
}

.search-box input::placeholder { color: #94a3b8; }

/* ICON BUTTON */
.icon-btn {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.icon-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f766e;
}

.icon-btn:active { transform: scale(0.98); }

/* NOTIFICATION */
.notif-wrap { position: relative; }

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #dc2626;
  color: #ffffff;
  font-size: 10.5px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  font-variant-numeric: tabular-nums;
}

.notif-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-width: calc(100vw - 32px);
  background: #ffffff;
  border: 1px solid #e5e9ef;
  border-radius: 12px;
  box-shadow: 0 12px 32px -8px rgba(13, 27, 42, 0.16), 0 4px 12px -4px rgba(13, 27, 42, 0.08);
  overflow: hidden;
  z-index: 100;
}

.notif-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #eef1f6;
}

.notif-head-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.notif-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #0d1b2a;
}

.notif-sub {
  font-size: 11.5px;
  color: #8b95a5;
}

.notif-action {
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 600;
  color: #2f6bff;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.notif-action:hover { background: #eef2ff; }

.notif-body {
  max-height: 400px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.notif-body::-webkit-scrollbar { width: 4px; }
.notif-body::-webkit-scrollbar-track { background: transparent; }
.notif-body::-webkit-scrollbar-thumb { background: #d5dae2; border-radius: 4px; }

.notif-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px 16px;
  font-size: 12.5px;
  color: #8b95a5;
}

.notif-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #e5e9ef;
  border-top-color: #2f6bff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 32px 20px;
  text-align: center;
}

.notif-empty strong {
  font-size: 13px;
  font-weight: 600;
  color: #0d1b2a;
  margin-top: 4px;
}

.notif-empty span {
  font-size: 11.5px;
  color: #8b95a5;
  line-height: 1.5;
  max-width: 240px;
}

.notif-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #eef1f6;
  cursor: pointer;
  transition: background 0.15s ease;
}

.notif-item:hover { background: #fafbfd; }

.notif-item.is-unread {
  background: linear-gradient(90deg, #eef2ff 0%, #ffffff 60%);
}

.notif-item.is-unread:hover { background: #e6ecff; }

.notif-item:last-child { border-bottom: none; }

.notif-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #0d1b2a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11.5px;
  font-weight: 700;
  flex-shrink: 0;
}

.notif-body-text { flex: 1; min-width: 0; }

.notif-item-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 3px;
}

.notif-item-title {
  font-size: 13px;
  font-weight: 600;
  color: #0d1b2a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
}

.notif-item-time {
  font-size: 10.5px;
  color: #8b95a5;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.notif-item-preview {
  margin: 0;
  font-size: 12px;
  color: #8b95a5;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.notif-item-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2f6bff;
  flex-shrink: 0;
  margin-top: 12px;
}

.notif-foot {
  padding: 10px 16px;
  border-top: 1px solid #eef1f6;
  display: flex;
  justify-content: center;
}

.notif-foot-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #2f6bff;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 6px;
}

.notif-foot-link:hover { background: #eef2ff; }

.notif-enter-active,
.notif-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.notif-enter-from,
.notif-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* USER */
.user-box {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding-left: 4px;
}

.user-avatar {
  background: #0f766e !important;
  color: #ffffff !important;
  flex-shrink: 0;
}

.avatar-text {
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.2px;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-info strong {
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.user-info span {
  font-size: 12px;
  line-height: 16px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

/* MOBILE MENU */
.mobile-menu {
  display: none;
  width: 40px;
  height: 40px;
  min-width: 40px;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #334155;
  cursor: pointer;
}

.mobile-menu:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* ================================================================
   PAGE
================================================================ */
.page-container {
  width: 100%;
  box-sizing: border-box;
  padding: 32px;
  overflow-x: hidden;
}

/* Saat fullscreen mode → hilangkan padding */
.page-container--fullscreen {
  padding: 0;
}

/* ================================================================
   RESPONSIVE
================================================================ */
@media (max-width: 1100px) {
  .topbar { padding: 0 24px; }
  .search-box { width: 220px; }
}

@media (max-width: 900px) {
  .topbar { padding: 0 20px; gap: 12px; }
  .topbar-left { gap: 12px; }
  .search-box { width: 190px; }
  .page-container { padding: 24px; }
}

@media (max-width: 768px) {
  .topbar { height: 64px; padding: 0 16px; gap: 10px; }
  .mobile-menu { display: flex; }
  .topbar-left { gap: 10px; min-width: 0; }
  .page-title { font-size: 17px; }
  .page-subtitle { display: none; }
  .topbar-right { gap: 8px; }
  .search-box { display: none; }
  .notification-btn {
    width: 38px;
    height: 38px;
    min-width: 38px;
    border-radius: 10px;
  }
  .notif-dropdown {
    width: 340px;
    max-width: calc(100vw - 24px);
  }
  .notif-body { max-height: 320px; }
  .user-box { gap: 0; }
  .user-info { display: none; }
  .user-box .v-avatar {
    width: 38px !important;
    height: 38px !important;
  }
  .page-container { padding: 20px 16px; }
}

@media (max-width: 480px) {
  .topbar { padding: 0 12px; }
  .topbar-left { gap: 8px; }
  .mobile-menu {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }
  .page-title { font-size: 16px; }
  .notification-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }
  .notif-dropdown {
    width: calc(100vw - 20px);
    right: -50px;
    max-width: none;
  }
  .user-box .v-avatar {
    width: 36px !important;
    height: 36px !important;
  }
  .page-container { padding: 16px 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .notif-enter-active,
  .notif-leave-active,
  .notif-spinner {
    transition: none;
    animation: none;
  }
}
</style>
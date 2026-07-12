<template>
  <v-app class="app-layout">

    <!-- SIDEBAR -->
    <VerticalNav
      :menu="menu"
      :logoText="logoText"
    />

    <!-- MAIN -->
    <v-main class="main-wrapper">

      <!-- TOPBAR -->
      <header class="topbar">

        <!-- LEFT -->
        <div class="topbar-left">

          <button
            class="mobile-menu"
            @click="drawer = !drawer"
          >
            ☰
          </button>

          <div>
            <h2 class="page-title">
              Portal Pelamar
            </h2>

            <p class="page-subtitle">
              Temukan peluang karir terbaik
            </p>
          </div>

        </div>

        <!-- RIGHT -->
        <div class="topbar-right">

          <!-- SEARCH -->
          <div class="search-box">

            <v-icon size="18">
              mdi-magnify
            </v-icon>

            <input
              type="text"
              placeholder="Cari lowongan..."
            />

          </div>

          <!-- NOTIFICATION -->
          <button class="icon-btn">
            <v-icon>mdi-bell-outline</v-icon>
          </button>

          <!-- USER -->
          <div class="user-box">

            <v-avatar
              size="40"
              color="#2563EB"
            >
              <span class="avatar-text">
                U
              </span>
            </v-avatar>

            <div class="user-info">

              <strong>User</strong>

              <span>Pelamar</span>

            </div>

          </div>

        </div>

      </header>

      <!-- PAGE -->
      <div class="page-container">
        <router-view />
      </div>

    </v-main>

  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import VerticalNav from "./sidebar/VerticalNav.vue"

import { rekrutmenUserMenu }
from "../menu/rekrutmen.menu"

const menu =
  computed(() => rekrutmenUserMenu)

const logoText =
  computed(() => "Portal Pelamar")

const drawer = ref(true)
</script>

<style scoped>
.app-layout {
  background: #F8FAFC;
}

/* MAIN */
.main-wrapper {
  background: #F8FAFC;
  min-height: 100vh;
}

/* TOPBAR */
.topbar {
  height: 76px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);

  border-bottom: 1px solid #E2E8F0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 32px;

  position: sticky;
  top: 0;
  z-index: 10;
}

/* LEFT */
.topbar-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.page-subtitle {
  margin: 0;
  font-size: 13px;
  color: #64748B;
}

/* RIGHT */
.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* SEARCH */
.search-box {
  width: 280px;
  height: 42px;

  background: white;

  border: 1px solid #E2E8F0;
  border-radius: 14px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0 14px;

  color: #64748B;
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  background: transparent;
}

/* BUTTON */
.icon-btn {
  width: 42px;
  height: 42px;

  border-radius: 14px;

  border: 1px solid #E2E8F0;

  background: white;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.2s;
}

.icon-btn:hover {
  background: #EFF6FF;
}

/* USER */
.user-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info strong {
  font-size: 14px;
  color: #0F172A;
}

.user-info span {
  font-size: 12px;
  color: #64748B;
}

.avatar-text {
  color: white;
  font-weight: 700;
}

/* PAGE */
.page-container {
  padding: 32px;
}

/* MOBILE */
.mobile-menu {
  display: none;
}

@media (max-width: 768px) {

  .topbar {
    padding: 0 16px;
  }

  .search-box {
    display: none;
  }

  .mobile-menu {
    display: block;

    background: none;
    border: none;

    font-size: 22px;

    cursor: pointer;
  }

  .page-container {
    padding: 20px;
  }

}
</style>
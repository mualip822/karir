<template>
  <div class="presensi-page">
    <main class="page-body">
      <!-- WELCOME CARD -->
      <section v-if="today?.employee" class="welcome-card">
        <div class="welcome-avatar">
          <img v-if="employeePhoto" :src="employeePhoto" alt="Foto pegawai" />
          <span v-else>{{ employeeInitial }}</span>
        </div>

        <div class="welcome-info">
          <span class="welcome-eyebrow">SELAMAT DATANG</span>
          <strong>{{ today.employee.nama }}</strong>
          <small>
            {{ today.employee.jabatan || today.employee.posisi || "Pegawai" }}
          </small>
        </div>
      </section>

      <!-- LOADING -->
      <div v-if="pageLoading" class="skeleton-stack">
        <div class="skeleton row-skeleton"></div>
        <div class="skeleton row-skeleton"></div>
        <div class="skeleton row-skeleton"></div>
      </div>

      <template v-else>
        <!-- TIMES STRIP -->
        <section class="times-strip">
          <div class="time-item">
            <span>Jam Masuk</span>
            <strong>{{ formatTime(today?.presensi?.jamMasuk) }}</strong>
          </div>

          <div class="time-divider"></div>

          <div class="time-item">
            <span>Jam Pulang</span>
            <strong>{{ formatTime(today?.presensi?.jamPulang) }}</strong>
          </div>
        </section>

        <!-- ATTENDANCE -->
        <section class="card action-card">
          <div class="card-head">
            <div>
              <span class="eyebrow">
                {{ isCheckIn ? "CHECK-IN" : "CHECK-OUT" }}
              </span>
              <h2>Pilih metode presensi</h2>
              <p>Absen biasa, dengan foto, atau menggunakan Face ID.</p>
            </div>
          </div>

          <div class="segmented">
            <button
              type="button"
              class="seg-btn"
              :class="{ active: selectedMethod === 'MANUAL' }"
              :disabled="submitting"
              @click="selectMethod('MANUAL')"
            >
              <span class="seg-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span class="seg-text">
                <strong>Biasa</strong>
                <small>Tanpa foto</small>
              </span>
            </button>

            <button
              type="button"
              class="seg-btn"
              :class="{ active: selectedMethod === 'FOTO' }"
              :disabled="submitting"
              @click="selectMethod('FOTO')"
            >
              <span class="seg-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </span>
              <span class="seg-text">
                <strong>Foto</strong>
                <small>Selfie bukti</small>
              </span>
            </button>

            <button
              type="button"
              class="seg-btn"
              :class="{
                active: selectedMethod === 'FACE_RECOGNITION',
                'seg-disabled': !faceStatus?.registered || submitting,
              }"
              :disabled="!faceStatus?.registered || submitting"
              @click="selectMethod('FACE_RECOGNITION')"
            >
              <span class="seg-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
                </svg>
              </span>
              <span class="seg-text">
                <strong>Face ID</strong>
                <small>
                  {{ faceStatus?.registered ? "Wajah aktif" : "Belum daftar" }}
                </small>
              </span>
            </button>
          </div>

          <!-- GPS -->
          <div
            class="gps-row"
            :class="{
              'gps-ready': locationReady,
              'gps-error': !!locationError && !locationLoading,
            }"
          >
            <div class="gps-info">
              <span
                class="gps-dot"
                :class="{
                  ready: locationReady,
                  error: !!locationError && !locationLoading,
                }"
              ></span>
              <div>
                <strong>Lokasi GPS</strong>
                <small>
                  {{
                    locationLoading
                      ? "Mendeteksi lokasi Anda…"
                      : locationReady
                        ? "Lokasi terdeteksi. Siap digunakan untuk presensi."
                        : locationError
                          ? locationError
                          : "Menunggu deteksi lokasi…"
                  }}
                </small>
              </div>
            </div>

            <button
              v-if="!locationReady && !locationLoading"
              type="button"
              class="btn-ghost"
              :disabled="submitting"
              @click="loadLocation"
            >
              Coba Lagi
            </button>

            <span v-else-if="locationReady" class="gps-badge">Aktif</span>
          </div>

          <div
            v-if="selectedMethod === 'FACE_RECOGNITION' && faceAutoProcessing"
            class="face-processing"
          >
            <div class="face-processing-icon">
              <span class="pulse"></span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
              </svg>
            </div>
            <div>
              <strong>{{ faceProcessingText }}</strong>
              <small>
                {{
                  isCheckIn
                    ? "Sistem otomatis check-in setelah wajah terverifikasi."
                    : "Sistem otomatis check-out setelah wajah terverifikasi."
                }}
              </small>
            </div>
          </div>

          <div
            v-if="capturedPhoto && selectedMethod !== 'FACE_RECOGNITION'"
            class="photo-preview"
          >
            <div>
              <strong>Foto siap digunakan</strong>
              <small>Foto akan disimpan sebagai bukti presensi.</small>
            </div>
            <button
              type="button"
              class="btn-ghost"
              :disabled="submitting"
              @click="retakePhoto"
            >
              Ambil Ulang
            </button>
          </div>

          <button
            v-if="selectedMethod !== 'FACE_RECOGNITION'"
            type="button"
            class="btn-primary"
            :disabled="
              submitting ||
              !today?.isActiveEmployee ||
              (selectedMethod !== 'MANUAL' && !capturedPhoto)
            "
            @click="submitAttendance"
          >
            {{
              submitting
                ? "Memproses…"
                : isCheckIn
                  ? "Check-In Sekarang"
                  : "Check-Out Sekarang"
            }}
          </button>

          <div
            v-if="faceAutoProcessing && selectedMethod === 'FACE_RECOGNITION'"
            class="face-auto-status"
            :class="{
              success: faceAutoSuccess,
              error: !!actionError,
            }"
          >
            <span v-if="!faceAutoSuccess">{{ faceProcessingText }}</span>
            <span v-else>{{ actionSuccess }}</span>
          </div>
        </section>

        <!-- INFO GRID -->
        <section class="info-grid">
          <div class="card info-card">
            <div class="info-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
              </svg>
            </div>
            <div class="info-body">
              <span class="eyebrow">FACE ID</span>
              <strong>
                {{
                  faceStatus?.registered
                    ? "Wajah terdaftar"
                    : "Wajah belum terdaftar"
                }}
              </strong>
              <small>Hanya diperlukan untuk Face Recognition.</small>
            </div>
            <button
              type="button"
              class="btn-ghost"
              :disabled="submitting || registeringFace"
              @click="openFaceRegistration"
            >
              {{ faceStatus?.registered ? "Daftar Ulang" : "Daftarkan" }}
            </button>
          </div>

          <div v-if="today?.shift" class="card info-card">
            <div class="info-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div class="info-body">
              <span class="eyebrow">SHIFT HARI INI</span>
              <strong>{{ today.shift.nama }}</strong>
              <small>{{ today.shift.jamMasuk }} – {{ today.shift.jamPulang }}</small>
            </div>
          </div>
        </section>

        <!-- RIWAYAT -->
        <section class="card history-card">
          <div class="card-head">
            <div>
              <span class="eyebrow">RIWAYAT</span>
              <h2>10 Presensi Terakhir</h2>
            </div>
          </div>

          <div v-if="history.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <strong>Belum ada riwayat presensi</strong>
            <small>Riwayat akan muncul setelah kamu melakukan presensi.</small>
          </div>

          <ul v-else class="history-list">
            <li v-for="item in history" :key="item.id" class="history-item">
              <div class="history-date">
                <strong>{{ formatDate(item.tanggal) }}</strong>
                <small>{{ item.metodeMasuk || "MANUAL" }}</small>
              </div>

              <div class="history-times">
                <div>
                  <span class="dot dot-in"></span>
                  <div>
                    <strong>{{ formatTime(item.jamMasuk) }}</strong>
                    <small>Masuk</small>
                  </div>
                </div>
                <div>
                  <span class="dot dot-out"></span>
                  <div>
                    <strong>{{ formatTime(item.jamPulang) }}</strong>
                    <small>Pulang</small>
                  </div>
                </div>
              </div>

              <span class="history-status" :class="{ 'status-ok': item.status }">
                {{ item.status }}
              </span>
            </li>
          </ul>
        </section>
      </template>
    </main>

    <!-- FULLSCREEN CAMERA — ABSEN -->
    <transition name="fullscreen">
      <div
        v-if="showCamera"
        class="camera-overlay"
        role="dialog"
        aria-modal="true"
      >
        <header class="camera-header">
          <div class="camera-header-text">
            <span class="camera-header-eyebrow">
              {{ isCheckIn ? "CHECK-IN" : "CHECK-OUT" }}
            </span>
            <strong>
              {{
                selectedMethod === "FACE_RECOGNITION"
                  ? "Verifikasi Wajah"
                  : "Ambil Foto"
              }}
            </strong>
          </div>

          <button
            type="button"
            class="camera-close"
            aria-label="Tutup kamera"
            @click="closeCamera"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div class="camera-stage">
          <FaceCamera
            :loading="submitting || registeringFace"
            @capture="handleCameraCapture"
            @close="closeCamera"
          />
        </div>

        <p class="camera-hint">
          {{
            selectedMethod === "FACE_RECOGNITION"
              ? "Arahkan wajah ke kamera. Sistem akan memverifikasi secara otomatis."
              : "Posisikan wajah di tengah frame, lalu ambil foto."
          }}
        </p>
      </div>
    </transition>

    <!-- FULLSCREEN CAMERA — FACE REGISTRATION -->
    <transition name="fullscreen">
      <div
        v-if="showFaceRegistration"
        class="camera-overlay"
        role="dialog"
        aria-modal="true"
      >
        <header class="camera-header">
          <div class="camera-header-text">
            <span class="camera-header-eyebrow">FACE REGISTRATION</span>
            <strong>Daftarkan Wajah</strong>
          </div>

          <button
            type="button"
            class="camera-close"
            :disabled="registeringFace"
            aria-label="Tutup"
            @click="showFaceRegistration = false"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div class="camera-stage">
          <FaceCamera
            :loading="registeringFace"
            @capture="handleFaceRegistration"
            @close="showFaceRegistration = false"
          />
        </div>

        <p v-if="faceRegisterError" class="camera-error">
          {{ faceRegisterError }}
        </p>
        <p v-else class="camera-hint">
          Posisikan wajah di tengah frame dengan pencahayaan yang cukup.
        </p>
      </div>
    </transition>

    <!-- TOAST -->
    <transition name="toast">
      <div
        v-if="actionSuccess || actionError"
        class="toast"
        :class="actionError ? 'toast-error' : 'toast-success'"
        @click="actionError = ''; actionSuccess = ''"
      >
        <span class="toast-icon">
          <svg v-if="!actionError" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
        <span>{{ actionError || actionSuccess }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import FaceCamera from "../components/FaceCamera.vue";
import presensiService from "../services/presensiService";

import type {
  FaceStatus,
  Presensi,
  TodayPresensiResponse,
  VerificationMethod,
} from "../types/presensi.types";

/* ============================================================
   STATE
============================================================ */

const pageLoading = ref(true);
const today = ref<TodayPresensiResponse | null>(null);
const faceStatus = ref<FaceStatus | null>(null);
const history = ref<Presensi[]>([]);

const selectedMethod = ref<VerificationMethod>("MANUAL");
const capturedPhoto = ref<Blob | null>(null);

const showCamera = ref(false);
const showFaceRegistration = ref(false);
const registeringFace = ref(false);
const submitting = ref(false);

const actionError = ref("");
const actionSuccess = ref("");
const faceRegisterError = ref("");

const locationLoading = ref(false);
const locationReady = ref(false);
const locationError = ref("");
const currentLocation = ref<{
  latitude: number;
  longitude: number;
  accuracy: number;
} | null>(null);

const currentDate = ref("");
const currentTime = ref("");

const faceAutoProcessing = ref(false);
const faceAutoSuccess = ref(false);
const faceProcessingText = ref("Menyiapkan verifikasi wajah…");

let clockTimer: number | null = null;
let faceCaptureLocked = false;
let toastTimer: number | null = null;

/* ============================================================
   COMPUTED
============================================================ */

const isCheckIn = computed(() => !today.value?.presensi?.jamMasuk);

const employeeInitial = computed(() => {
  const name = today.value?.employee?.nama || "P";
  return name.trim().charAt(0).toUpperCase();
});

const employeePhoto = computed(() => {
  const foto = today.value?.employee?.foto;
  if (!foto) return "";
  if (foto.startsWith("http://") || foto.startsWith("https://")) return foto;

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${apiUrl}${foto.startsWith("/") ? "" : "/"}${foto}`;
});

/* ============================================================
   CLOCK
============================================================ */

function updateClock() {
  const now = new Date();
  currentDate.value = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  currentTime.value = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* ============================================================
   FORMAT
============================================================ */

function formatTime(value?: string | null) {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ============================================================
   TOAST
============================================================ */

function showToast(success: string, error = "") {
  actionSuccess.value = success;
  actionError.value = error;

  if (toastTimer !== null) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    actionSuccess.value = "";
    actionError.value = "";
  }, 4500);
}

/* ============================================================
   LOAD DATA
============================================================ */

async function loadData() {
  pageLoading.value = true;
  try {
    const [todayData, faceData, historyData] = await Promise.all([
      presensiService.getToday(),
      presensiService.getFaceStatus(),
      presensiService.getHistory(1, 10),
    ]);

    today.value = todayData;
    faceStatus.value = faceData;
    history.value = historyData.data ?? historyData.items ?? [];
  } catch (error: any) {
    console.error("Presensi load error:", error);
    showToast(
      "",
      error?.response?.data?.message ||
        error?.message ||
        "Gagal memuat data presensi.",
    );
  } finally {
    pageLoading.value = false;
  }
}

/* ============================================================
   GPS
============================================================ */

async function loadLocation() {
  locationLoading.value = true;
  locationError.value = "";
  try {
    currentLocation.value = await presensiService.getCurrentLocation();
    locationReady.value = true;
  } catch (error: any) {
    console.warn("GPS unavailable:", error);
    currentLocation.value = null;
    locationReady.value = false;
    locationError.value =
      error?.message ||
      "Gagal mendeteksi lokasi. Aktifkan izin GPS dan coba lagi.";
  } finally {
    locationLoading.value = false;
  }
}

async function ensureLocation(): Promise<boolean> {
  if (locationReady.value && currentLocation.value) return true;
  await loadLocation();
  return locationReady.value && !!currentLocation.value;
}

/* ============================================================
   SELECT METHOD
============================================================ */

function selectMethod(method: VerificationMethod) {
  if (submitting.value) return;

  actionError.value = "";
  actionSuccess.value = "";
  faceAutoSuccess.value = false;
  capturedPhoto.value = null;
  faceCaptureLocked = false;
  selectedMethod.value = method;

  if (method === "MANUAL") {
    showCamera.value = false;
    faceAutoProcessing.value = false;
    return;
  }

  if (method === "FOTO") {
    showCamera.value = true;
    faceAutoProcessing.value = false;
    return;
  }

  if (method === "FACE_RECOGNITION") {
    if (!faceStatus.value?.registered) {
      showToast(
        "",
        "Wajah belum terdaftar. Silakan daftarkan wajah terlebih dahulu.",
      );
      selectedMethod.value = "MANUAL";
      return;
    }
    faceAutoProcessing.value = true;
    faceProcessingText.value = isCheckIn.value
      ? "Menyiapkan check-in otomatis…"
      : "Menyiapkan check-out otomatis…";
    showCamera.value = true;
  }
}

/* ============================================================
   CAMERA
============================================================ */

function closeCamera() {
  if (
    faceAutoProcessing.value &&
    !submitting.value &&
    !faceAutoSuccess.value
  ) {
    faceAutoProcessing.value = false;
    faceProcessingText.value = "Verifikasi dibatalkan.";
  }
  showCamera.value = false;
}

function retakePhoto() {
  if (submitting.value) return;
  capturedPhoto.value = null;
  showCamera.value = true;
}

async function handleCameraCapture(file: Blob) {
  if (faceCaptureLocked) return;
  faceCaptureLocked = true;

  if (selectedMethod.value === "FACE_RECOGNITION") {
    capturedPhoto.value = file;
    showCamera.value = false;
    await submitFaceAttendance(file);
    return;
  }

  capturedPhoto.value = file;
  showCamera.value = false;
  faceCaptureLocked = false;
}

/* ============================================================
   FACE REGISTRATION
============================================================ */

function openFaceRegistration() {
  faceRegisterError.value = "";
  showFaceRegistration.value = true;
}

async function handleFaceRegistration(file: Blob) {
  registeringFace.value = true;
  faceRegisterError.value = "";
  try {
    const result = await presensiService.registerFace(file);
    if (!result?.registered) {
      throw new Error("Wajah gagal didaftarkan.");
    }
    faceStatus.value = {
      registered: true,
      faceId: result.faceId ?? null,
      fotoPath: result.fotoPath ?? null,
    };
    showFaceRegistration.value = false;
    showToast("Wajah berhasil didaftarkan.");
  } catch (error: any) {
    console.error("Face registration error:", error);
    faceRegisterError.value =
      error?.response?.data?.message ||
      error?.message ||
      "Gagal mendaftarkan wajah.";
  } finally {
    registeringFace.value = false;
  }
}

/* ============================================================
   BUILD PAYLOAD
============================================================ */

function buildAttendancePayload(file: Blob | null) {
  return {
    foto: file,
    latitude: currentLocation.value?.latitude ?? null,
    longitude: currentLocation.value?.longitude ?? null,
    alamat: null,
    metode: selectedMethod.value,
    catatan: null,
  };
}

/* ============================================================
   FACE AUTO ATTENDANCE
============================================================ */

async function submitFaceAttendance(file: Blob) {
  actionError.value = "";
  actionSuccess.value = "";
  faceAutoSuccess.value = false;

  if (!today.value?.isActiveEmployee) {
    showToast("", "Akun pegawai tidak aktif.");
    faceAutoProcessing.value = false;
    faceCaptureLocked = false;
    return;
  }

  if (!faceStatus.value?.registered) {
    showToast("", "Wajah belum terdaftar.");
    faceAutoProcessing.value = false;
    faceCaptureLocked = false;
    return;
  }

  submitting.value = true;
  faceAutoProcessing.value = true;
  faceProcessingText.value = "Memverifikasi lokasi…";

  try {
    const locOk = await ensureLocation();
    if (!locOk) {
      throw new Error(
        "Lokasi GPS wajib aktif. Aktifkan izin lokasi lalu coba lagi.",
      );
    }

    faceProcessingText.value = "Memverifikasi wajah…";
    const payload = buildAttendancePayload(file);

    if (isCheckIn.value) {
      faceProcessingText.value = "Wajah terverifikasi. Menyimpan check-in…";
      await presensiService.checkIn(payload);
      showToast("Check-in berhasil. Wajah terverifikasi.");
      faceProcessingText.value = "Check-in berhasil.";
    } else {
      faceProcessingText.value = "Wajah terverifikasi. Menyimpan check-out…";
      await presensiService.checkOut(payload);
      showToast("Check-out berhasil. Wajah terverifikasi.");
      faceProcessingText.value = "Check-out berhasil.";
    }

    faceAutoSuccess.value = true;
    capturedPhoto.value = null;
    selectedMethod.value = "MANUAL";
    showCamera.value = false;
    await loadData();
  } catch (error: any) {
    console.error("Face automatic attendance error:", error);
    showToast(
      "",
      error?.response?.data?.message ||
        error?.message ||
        "Presensi Face Recognition gagal.",
    );
    faceProcessingText.value = "Verifikasi wajah gagal.";
    faceAutoSuccess.value = false;
  } finally {
    submitting.value = false;
    faceCaptureLocked = false;
  }
}

/* ============================================================
   SUBMIT MANUAL / FOTO
============================================================ */

async function submitAttendance() {
  actionError.value = "";
  actionSuccess.value = "";

  if (selectedMethod.value === "FACE_RECOGNITION") {
    if (capturedPhoto.value) await submitFaceAttendance(capturedPhoto.value);
    return;
  }

  if (!today.value?.isActiveEmployee) {
    showToast("", "Akun pegawai tidak aktif.");
    return;
  }

  if (selectedMethod.value !== "MANUAL" && !capturedPhoto.value) {
    showToast("", "Silakan ambil foto terlebih dahulu.");
    return;
  }

  submitting.value = true;
  try {
    const locOk = await ensureLocation();
    if (!locOk) {
      throw new Error(
        "Lokasi GPS wajib aktif. Aktifkan izin lokasi lalu coba lagi.",
      );
    }

    const payload = buildAttendancePayload(capturedPhoto.value);

    if (isCheckIn.value) {
      await presensiService.checkIn(payload);
      showToast("Check-in berhasil.");
    } else {
      await presensiService.checkOut(payload);
      showToast("Check-out berhasil.");
    }

    capturedPhoto.value = null;
    selectedMethod.value = "MANUAL";
    showCamera.value = false;
    await loadData();
  } catch (error: any) {
    console.error("Presensi action error:", error);
    showToast(
      "",
      error?.response?.data?.message || error?.message || "Presensi gagal.",
    );
  } finally {
    submitting.value = false;
  }
}

/* ============================================================
   BODY SCROLL LOCK
============================================================ */

watch(
  [showCamera, showFaceRegistration],
  ([cam, reg]) => {
    const locked = cam || reg;
    document.body.style.overflow = locked ? "hidden" : "";
  },
  { immediate: true },
);

/* ============================================================
   LIFECYCLE
============================================================ */

onMounted(async () => {
  updateClock();
  clockTimer = window.setInterval(updateClock, 1000);

  loadLocation();

  await loadData();
});

onBeforeUnmount(() => {
  if (clockTimer !== null) window.clearInterval(clockTimer);
  if (toastTimer !== null) window.clearTimeout(toastTimer);
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* ============================================================
   TOKENS
============================================================ */

.presensi-page {
  --brand-primary: #2f6bff;
  --brand-primary-hover: #1e4fe0;
  --brand-primary-active: #1944c7;
  --brand-primary-soft: #eff4ff;
  --brand-primary-tint: #f5f8ff;
  --brand-primary-border: #c9d9ff;

  --page-bg: #f7f8fa;
  --surface: #ffffff;
  --surface-subtle: #f9fafb;

  --border: #e5e7eb;
  --border-subtle: #f1f5f9;
  --border-strong: #d1d5db;

  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;

  --success: #10b981;
  --success-bg: #ecfdf5;
  --success-border: #a7f3d0;
  --success-text: #047857;

  --danger: #ef4444;
  --danger-bg: #fef2f2;
  --danger-border: #fecaca;
  --danger-text: #b91c1c;

  --warn: #f59e0b;
  --warn-bg: #fffbeb;
  --warn-border: #fde68a;
  --warn-text: #b45309;

  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 10px;

  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-lg: 0 12px 32px -12px rgba(15, 23, 42, 0.16);

  min-height: 100%;
  background: var(--page-bg);
  color: var(--text-primary);
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11", "ss01";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============================================================
   PAGE BODY
============================================================ */

.page-body {
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

@media (min-width: 640px) {
  .page-body {
    padding: 24px 24px 56px;
    gap: 18px;
  }
}

@media (min-width: 1024px) {
  .page-body {
    max-width: 1000px;
    padding: 28px 32px 64px;
    gap: 20px;
  }
}

@media (min-width: 1280px) {
  .page-body {
    max-width: 1080px;
    padding: 32px 40px 80px;
  }
}

@media (max-width: 380px) {
  .page-body {
    padding: 16px 12px 40px;
    gap: 12px;
  }
}

/* Safe-area iPhone (notch) */
@supports (padding: max(0px)) {
  .page-body {
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
    padding-bottom: max(48px, calc(env(safe-area-inset-bottom) + 24px));
  }
}

/* ============================================================
   ★ FIX RESPONSIVE: RUANG UNTUK TOMBOL "MENU" FIXED
   Tombol .mobile-menu-trigger posisinya fixed top:14px + h:40px
   = ~54px dari atas. Beri padding-top agar konten tidak ketutupan.
============================================================ */

@media (max-width: 960px) {
  .page-body {
    padding-top: max(72px, calc(env(safe-area-inset-top) + 58px));
  }
}

/* ============================================================
   WELCOME CARD
============================================================ */

.welcome-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-xs);
}

.welcome-avatar {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: var(--brand-primary);
  font-weight: 700;
  font-size: 16px;
}

.welcome-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.welcome-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.welcome-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--brand-primary);
}

.welcome-info strong {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}

.welcome-info small {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ============================================================
   SKELETON
============================================================ */

.skeleton-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skeleton {
  border-radius: var(--radius-lg);
  background: linear-gradient(
    90deg,
    #eef2f7 0%,
    #f8fafc 50%,
    #eef2f7 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.row-skeleton {
  height: 90px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ============================================================
   TIMES STRIP
============================================================ */

.times-strip {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-xs);
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.time-item span {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

.time-item strong {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.015em;
}

.time-divider {
  width: 1px;
  height: 36px;
  background: var(--border);
}

/* ============================================================
   CARD
============================================================ */

.card {
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-xs);
}

.card-head {
  margin-bottom: 18px;
}

.card-head h2 {
  margin: 4px 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.card-head p {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.eyebrow {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--brand-primary);
}

/* ============================================================
   SEGMENTED
============================================================ */

.segmented {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.seg-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 14px 8px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;
  text-align: center;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  min-width: 0;
}

.seg-btn:hover:not(:disabled):not(.active) {
  border-color: var(--brand-primary-border);
  background: var(--brand-primary-tint);
}

.seg-btn.active {
  border-color: var(--brand-primary);
  background: var(--brand-primary);
  box-shadow:
    0 1px 2px rgba(47, 107, 255, 0.24),
    0 6px 16px -6px rgba(47, 107, 255, 0.4);
}

.seg-btn:disabled,
.seg-disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.seg-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--surface-subtle);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.seg-btn.active .seg-icon {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.24);
}

.seg-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.seg-text strong {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.seg-text small {
  font-size: 10.5px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.seg-btn.active .seg-text strong {
  color: #ffffff;
}

.seg-btn.active .seg-text small {
  color: rgba(255, 255, 255, 0.82);
}

/* ============================================================
   GPS ROW
============================================================ */

.gps-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--brand-primary-tint);
  border: 1px solid var(--brand-primary-border);
  transition: background 0.15s ease, border-color 0.15s ease;
}

.gps-row.gps-ready {
  background: var(--success-bg);
  border-color: var(--success-border);
}

.gps-row.gps-error {
  background: var(--warn-bg);
  border-color: var(--warn-border);
}

.gps-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.gps-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--brand-primary);
  flex: 0 0 9px;
  box-shadow: 0 0 0 4px rgba(47, 107, 255, 0.14);
  animation: pulse-dot 1.4s ease-in-out infinite;
}

.gps-dot.ready {
  background: var(--success);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.16);
  animation: none;
}

.gps-dot.error {
  background: var(--warn);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.16);
  animation: none;
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

.gps-info > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.gps-info strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.gps-info small {
  font-size: 11.5px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.gps-badge {
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--success-text);
  background: var(--surface);
  border: 1px solid var(--success-border);
}

/* ============================================================
   BUTTONS
============================================================ */

.btn-primary {
  width: 100%;
  min-height: 52px;
  margin-top: 18px;
  border: 0;
  border-radius: var(--radius-md);
  color: #ffffff;
  background: var(--brand-primary);
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.005em;
  cursor: pointer;
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
  box-shadow:
    0 1px 2px rgba(47, 107, 255, 0.24),
    0 6px 16px -6px rgba(47, 107, 255, 0.4);
}

.btn-primary:hover:not(:disabled) {
  background: var(--brand-primary-hover);
  box-shadow:
    0 1px 2px rgba(47, 107, 255, 0.28),
    0 8px 20px -6px rgba(47, 107, 255, 0.45);
}

.btn-primary:active:not(:disabled) {
  background: var(--brand-primary-active);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-ghost {
  padding: 8px 14px;
  min-height: 36px;
  border: 1px solid var(--border-strong);
  border-radius: 9px;
  color: var(--text-primary);
  background: var(--surface);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
  flex-shrink: 0;
}

.btn-ghost:hover:not(:disabled) {
  background: var(--brand-primary-soft);
  border-color: var(--brand-primary-border);
  color: var(--brand-primary);
}

.btn-ghost:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ============================================================
   FACE PROCESSING
============================================================ */

.face-processing {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid var(--brand-primary-border);
  border-radius: var(--radius-md);
  background: var(--brand-primary-tint);
}

.face-processing-icon {
  position: relative;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  background: var(--brand-primary);
}

.face-processing-icon .pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--brand-primary);
  opacity: 0.3;
  animation: pulse 1.6s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.35;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.face-processing > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.face-processing strong {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
}

.face-processing small {
  font-size: 11.5px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.face-auto-status {
  margin-top: 12px;
  padding: 10px 13px;
  border-radius: var(--radius-sm);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--surface-subtle);
  border: 1px solid var(--border);
}

.face-auto-status.success {
  color: var(--success-text);
  background: var(--success-bg);
  border-color: var(--success-border);
}

.face-auto-status.error {
  color: var(--danger-text);
  background: var(--danger-bg);
  border-color: var(--danger-border);
}

/* ============================================================
   PHOTO PREVIEW
============================================================ */

.photo-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding: 12px 14px;
  border: 1px solid var(--success-border);
  border-radius: var(--radius-md);
  background: var(--success-bg);
}

.photo-preview > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
}

.photo-preview strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--success-text);
}

.photo-preview small {
  font-size: 11.5px;
  color: #047857;
}

/* ============================================================
   INFO GRID
============================================================ */

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
}

.info-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
  border: 1px solid var(--brand-primary-border);
}

.info-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-body strong {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
}

.info-body small {
  font-size: 11.5px;
  color: var(--text-secondary);
}

/* ============================================================
   HISTORY
============================================================ */

.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.history-item {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "date status"
    "times times";
  gap: 10px 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.history-item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.history-date {
  grid-area: date;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.history-date strong {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
}

.history-date small {
  font-size: 10.5px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}

.history-times {
  grid-area: times;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: var(--surface-subtle);
  border: 1px solid var(--border-subtle);
}

.history-times > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-times strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.history-times small {
  display: block;
  font-size: 10.5px;
  color: var(--text-secondary);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: 0 0 8px;
}

.dot-in {
  background: var(--success);
}

.dot-out {
  background: var(--warn);
}

.history-status {
  grid-area: status;
  align-self: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  white-space: nowrap;
}

.status-ok {
  color: var(--success-text);
  background: var(--success-bg);
  border-color: var(--success-border);
}

/* ============================================================
   EMPTY STATE
============================================================ */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--surface-subtle);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  margin-bottom: 4px;
}

.empty-state strong {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-state small {
  font-size: 12px;
  color: var(--text-secondary);
}

/* ============================================================
   TOAST
   ★ FIX: z-index 4000 → di ATAS camera overlay (3000)
   ★ FIX: padding horizontal safe-area
============================================================ */

.toast {
  position: fixed;
  left: 50%;
  bottom: max(20px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 4000;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: min(92vw, 420px);
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  border: 1px solid transparent;
}

.toast-success {
  color: var(--success-text);
  background: var(--success-bg);
  border-color: var(--success-border);
}

.toast-error {
  color: var(--danger-text);
  background: var(--danger-bg);
  border-color: var(--danger-border);
}

.toast-icon {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.22s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}

/* ============================================================
   FULLSCREEN CAMERA OVERLAY
   ★ FIX: z-index 3000 → di ATAS .mobile-menu-trigger (2000)
   Supaya tombol "Menu" (garis 3) TIDAK muncul saat kamera buka.
============================================================ */

.camera-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  background: #05070d;
  color: #ffffff;
}

.camera-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  padding-top: max(14px, env(safe-area-inset-top));
  background: rgba(15, 23, 42, 0.96);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.camera-header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.camera-header-eyebrow {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #a8c1ff;
}

.camera-header-text strong {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.camera-close {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.camera-close:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.24);
}

.camera-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.camera-stage {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: #000000;
  position: relative;
  overflow: hidden;
}

.camera-stage > * {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 100%;
}

.camera-hint {
  flex-shrink: 0;
  margin: 0;
  padding: 14px 20px;
  padding-bottom: max(14px, env(safe-area-inset-bottom));
  background: rgba(15, 23, 42, 0.96);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  font-size: 12.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
}

.camera-error {
  flex-shrink: 0;
  margin: 0;
  padding: 14px 20px;
  padding-bottom: max(14px, env(safe-area-inset-bottom));
  background: rgba(239, 68, 68, 0.14);
  border-top: 1px solid rgba(239, 68, 68, 0.3);
  color: #fecaca;
  font-size: 12.5px;
  line-height: 1.5;
  font-weight: 500;
  text-align: center;
}

.fullscreen-enter-active,
.fullscreen-leave-active {
  transition: opacity 0.2s ease;
}

.fullscreen-enter-from,
.fullscreen-leave-to {
  opacity: 0;
}

/* ============================================================
   RESPONSIVE — TABLET (≥ 640px)
============================================================ */

@media (min-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }

  .history-item {
    grid-template-columns: 1.2fr 2fr auto;
    grid-template-areas: "date times status";
    align-items: center;
    gap: 16px;
  }
}

/* ============================================================
   RESPONSIVE — LAPTOP (≥ 1024px)
============================================================ */

@media (min-width: 1024px) {
  .card {
    padding: 24px;
  }

  .times-strip {
    padding: 20px 24px;
  }

  .time-item strong {
    font-size: 24px;
  }
}

/* ============================================================
   SMALL PHONE (≤ 380px)
============================================================ */

@media (max-width: 380px) {
  .welcome-card {
    padding: 14px;
    gap: 12px;
  }

  .welcome-avatar {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
  }

  .times-strip {
    padding: 14px 16px;
    gap: 12px;
  }

  .time-item strong {
    font-size: 19px;
  }

  .card {
    padding: 16px;
  }

  .segmented {
    gap: 8px;
  }

  .seg-btn {
    padding: 12px 6px;
  }

  .seg-icon {
    width: 32px;
    height: 32px;
  }

  .gps-row {
    padding: 12px 14px;
  }

  .camera-header {
    padding: 12px 14px;
  }

  .camera-close {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
  }

  /* small phone → menu button lebih pendek */
  .page-body {
    padding-top: max(66px, calc(env(safe-area-inset-top) + 54px));
  }
}
</style>
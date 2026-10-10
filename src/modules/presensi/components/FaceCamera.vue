<template>
  <div class="camera-wrapper">
    <!-- =========================================================
         CAMERA
    ========================================================== -->

    <div class="camera-box">
      <video
        ref="videoRef"
        class="camera-video"
        autoplay
        muted
        playsinline
      ></video>

      <!-- =======================================================
           DARK OVERLAY
      ======================================================== -->

      <div class="camera-overlay">
        <!-- =====================================================
             FACE GUIDE
        ====================================================== -->

        <div
          class="face-guide"
          :class="{
            ready: cameraReady,
            capturing: capturing,
            success: captureSuccess,
          }"
        >
          <span class="corner top-left"></span>
          <span class="corner top-right"></span>
          <span class="corner bottom-left"></span>
          <span class="corner bottom-right"></span>
        </div>

        <!-- =====================================================
             STATUS
        ====================================================== -->

        <div class="camera-status">
          <div
            class="status-dot"
            :class="{
              ready: cameraReady,
              capturing: capturing,
            }"
          ></div>

          <span>
            {{ statusText }}
          </span>
        </div>

        <!-- =====================================================
             COUNTDOWN
        ====================================================== -->

        <div
          v-if="countdown > 0"
          class="countdown"
        >
          {{ countdown }}
        </div>

        <!-- =====================================================
             TOP INFORMATION
        ====================================================== -->

        <div class="camera-tip">
          <strong>
            Posisikan wajah
          </strong>

          <span>
            Pastikan wajah berada di dalam frame.
          </span>
        </div>

        <!-- =====================================================
             CAPTURED
        ====================================================== -->

        <div
          v-if="captureSuccess"
          class="capture-success"
        >
          <div class="success-icon">
            ✓
          </div>

          <strong>
            Foto berhasil diambil
          </strong>
        </div>
      </div>

      <!-- =======================================================
           LOADING
      ======================================================== -->

      <div
        v-if="loading"
        class="camera-loading"
      >
        <div class="loading-spinner"></div>

        <span>
          Memproses...
        </span>
      </div>

      <!-- =======================================================
           ERROR
      ======================================================== -->

      <div
        v-if="cameraError"
        class="camera-error"
      >
        <strong>
          Kamera tidak dapat digunakan
        </strong>

        <span>
          {{ cameraError }}
        </span>

        <button
          type="button"
          class="retry-button"
          @click="startCamera"
        >
          Coba Lagi
        </button>
      </div>
    </div>

    <!-- =========================================================
         BOTTOM CONTROLS
    ========================================================== -->

    <div class="camera-controls">
      <button
        type="button"
        class="control-button secondary"
        :disabled="loading || capturing"
        @click="switchCamera"
      >
        <span class="control-icon">
          ↻
        </span>

        <span>
          Ganti Kamera
        </span>
      </button>

      <button
        type="button"
        class="control-button close"
        :disabled="loading"
        @click="closeCamera"
      >
        Tutup
      </button>
    </div>

    <!-- =========================================================
         INFORMATION
    ========================================================== -->

    <div class="camera-information">
      <div class="info-item">
        <span class="info-icon">
          ✓
        </span>

        <span>
          Kamera akan mengambil foto secara otomatis.
        </span>
      </div>

      <div class="info-item">
        <span class="info-icon">
          ✓
        </span>

        <span>
          Pastikan wajah terlihat jelas dan pencahayaan cukup.
        </span>
      </div>
    </div>

    <!-- =========================================================
         HIDDEN CANVAS
    ========================================================== -->

    <canvas
      ref="canvasRef"
      class="hidden-canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

/* ============================================================
   PROPS
============================================================ */

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    autoCaptureDelay?: number;
  }>(),
  {
    loading: false,
    autoCaptureDelay: 2500,
  },
);

/* ============================================================
   EMITS
============================================================ */

const emit =
  defineEmits<{
    (
      event: "capture",
      file: Blob,
    ): void;

    (
      event: "close",
    ): void;
  }>();

/* ============================================================
   ELEMENT
============================================================ */

const videoRef =
  ref<HTMLVideoElement | null>(
    null,
  );

const canvasRef =
  ref<HTMLCanvasElement | null>(
    null,
  );

/* ============================================================
   CAMERA STATE
============================================================ */

const stream =
  ref<MediaStream | null>(
    null,
  );

const cameraReady =
  ref(false);

const cameraError =
  ref("");

const capturing =
  ref(false);

const captureSuccess =
  ref(false);

const countdown =
  ref(0);

const facingMode =
  ref<"user" | "environment">(
    "user",
  );

/* ============================================================
   TIMER
============================================================ */

let autoCaptureTimer:
  | number
  | null = null;

let countdownTimer:
  | number
  | null = null;

/* ============================================================
   STATUS
============================================================ */

const statusText =
  computed(() => {
    if (props.loading) {
      return "Sedang memproses...";
    }

    if (captureSuccess.value) {
      return "Foto berhasil diambil";
    }

    if (capturing.value) {
      return "Mengambil foto...";
    }

    if (countdown.value > 0) {
      return "Tahan posisi...";
    }

    if (cameraReady.value) {
      return "Posisikan wajah di tengah";
    }

    return "Menyiapkan kamera...";
  });

/* ============================================================
   GET CAMERA CONSTRAINT
============================================================ */

function getCameraConstraints(): MediaStreamConstraints {
  return {
    audio: false,

    video: {
      facingMode: {
        ideal:
          facingMode.value,
      },

      width: {
        ideal: 1280,
      },

      height: {
        ideal: 720,
      },
    },
  };
}

/* ============================================================
   START CAMERA
============================================================ */

async function startCamera() {
  cameraError.value =
    "";

  cameraReady.value =
    false;

  captureSuccess.value =
    false;

  capturing.value =
    false;

  countdown.value =
    0;

  clearTimers();

  stopStream();

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    cameraError.value =
      "Browser tidak mendukung akses kamera.";

    return;
  }

  try {
    const mediaStream =
      await navigator.mediaDevices.getUserMedia(
        getCameraConstraints(),
      );

    stream.value =
      mediaStream;

    await nextTick();

    if (!videoRef.value) {
      stopStream();

      cameraError.value =
        "Video kamera tidak ditemukan.";

      return;
    }

    videoRef.value.srcObject =
      mediaStream;

    await videoRef.value.play();

    cameraReady.value =
      true;

    /*
     * Kamera sudah siap.
     *
     * Beri waktu agar pengguna memposisikan
     * wajah sebelum foto otomatis diambil.
     */
    startAutoCapture();
  } catch (error: any) {
    console.error(
      "Camera error:",
      error,
    );

    cameraError.value =
      getCameraErrorMessage(
        error,
      );

    cameraReady.value =
      false;
  }
}

/* ============================================================
   CAMERA ERROR MESSAGE
============================================================ */

function getCameraErrorMessage(
  error: any,
): string {
  if (
    error?.name ===
    "NotAllowedError"
  ) {
    return "Akses kamera ditolak. Silakan izinkan kamera pada browser.";
  }

  if (
    error?.name ===
    "PermissionDeniedError"
  ) {
    return "Akses kamera ditolak. Silakan izinkan kamera pada browser.";
  }

  if (
    error?.name ===
    "NotFoundError"
  ) {
    return "Kamera tidak ditemukan pada perangkat.";
  }

  if (
    error?.name ===
    "NotReadableError"
  ) {
    return "Kamera sedang digunakan aplikasi lain.";
  }

  if (
    error?.name ===
    "OverconstrainedError"
  ) {
    return "Kamera tidak mendukung konfigurasi yang diminta.";
  }

  return (
    error?.message ||
    "Kamera tidak dapat digunakan."
  );
}

/* ============================================================
   AUTO CAPTURE
============================================================ */

function startAutoCapture() {
  clearTimers();

  /*
   * Countdown dimulai setelah kamera siap.
   */
  countdown.value = 3;

  countdownTimer =
    window.setInterval(() => {
      if (
        countdown.value <= 1
      ) {
        clearCountdownTimer();

        countdown.value =
          0;

        capturePhoto();

        return;
      }

      countdown.value -=
        1;
    }, 1000);

  /*
   * Safety timer.
   *
   * Jika countdown tidak berjalan normal,
   * foto tetap otomatis diambil.
   */
  autoCaptureTimer =
    window.setTimeout(() => {
      if (
        !capturing.value &&
        !captureSuccess.value &&
        cameraReady.value
      ) {
        capturePhoto();
      }
    }, props.autoCaptureDelay + 1500);
}

/* ============================================================
   CAPTURE PHOTO
============================================================ */

async function capturePhoto() {
  if (
    capturing.value ||
    captureSuccess.value ||
    !cameraReady.value
  ) {
    return;
  }

  if (!videoRef.value) {
    return;
  }

  if (
    videoRef.value.readyState <
    HTMLMediaElement.HAVE_CURRENT_DATA
  ) {
    cameraError.value =
      "Kamera belum siap. Silakan coba lagi.";

    return;
  }

  capturing.value =
    true;

  clearTimers();

  try {
    const video =
      videoRef.value;

    const canvas =
      canvasRef.value;

    if (!canvas) {
      throw new Error(
        "Canvas kamera tidak tersedia.",
      );
    }

    const width =
      video.videoWidth ||
      1280;

    const height =
      video.videoHeight ||
      720;

    canvas.width =
      width;

    canvas.height =
      height;

    const context =
      canvas.getContext(
        "2d",
      );

    if (!context) {
      throw new Error(
        "Canvas tidak dapat digunakan.",
      );
    }

    /*
     * Kamera belakang/front tetap menggunakan
     * gambar asli dari video.
     */
    context.drawImage(
      video,
      0,
      0,
      width,
      height,
    );

    const blob =
      await canvasToBlob(
        canvas,
      );

    if (!blob) {
      throw new Error(
        "Gagal membuat file foto.",
      );
    }

    captureSuccess.value =
      true;

    capturing.value =
      false;

    cameraReady.value =
      false;

    /*
     * Beri sedikit waktu agar user melihat
     * status "Foto berhasil diambil".
     */
    window.setTimeout(() => {
      emit(
        "capture",
        blob,
      );

      stopStream();
    }, 350);
  } catch (error: any) {
    console.error(
      "Capture error:",
      error,
    );

    capturing.value =
      false;

    cameraError.value =
      error?.message ||
      "Gagal mengambil foto.";

    /*
     * Kalau gagal, kamera tetap hidup
     * dan bisa mencoba lagi.
     */
    if (
      stream.value
    ) {
      cameraReady.value =
        true;

      startAutoCapture();
    }
  }
}

/* ============================================================
   CANVAS TO BLOB
============================================================ */

function canvasToBlob(
  canvas: HTMLCanvasElement,
): Promise<Blob | null> {
  return new Promise(
    (resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(
            blob,
          );
        },
        "image/jpeg",
        0.9,
      );
    },
  );
}

/* ============================================================
   SWITCH CAMERA
============================================================ */

async function switchCamera() {
  if (
    props.loading ||
    capturing.value
  ) {
    return;
  }

  facingMode.value =
    facingMode.value ===
    "user"
      ? "environment"
      : "user";

  await startCamera();
}

/* ============================================================
   CLOSE
============================================================ */

function closeCamera() {
  clearTimers();

  stopStream();

  emit(
    "close",
  );
}

/* ============================================================
   STOP STREAM
============================================================ */

function stopStream() {
  if (
    stream.value
  ) {
    stream.value
      .getTracks()
      .forEach(
        (track) => {
          track.stop();
        },
      );

    stream.value =
      null;
  }

  if (
    videoRef.value
  ) {
    videoRef.value.srcObject =
      null;
  }

  cameraReady.value =
    false;
}

/* ============================================================
   CLEAR TIMERS
============================================================ */

function clearCountdownTimer() {
  if (
    countdownTimer !==
    null
  ) {
    window.clearInterval(
      countdownTimer,
    );

    countdownTimer =
      null;
  }
}

function clearTimers() {
  clearCountdownTimer();

  if (
    autoCaptureTimer !==
    null
  ) {
    window.clearTimeout(
      autoCaptureTimer,
    );

    autoCaptureTimer =
      null;
  }
}

/* ============================================================
   LIFECYCLE
============================================================ */

onMounted(() => {
  startCamera();
});

onBeforeUnmount(() => {
  clearTimers();

  stopStream();
});
</script>

<style scoped>
.camera-wrapper {
  width: 100%;
}

.camera-box {
  position: relative;
  width: 100%;
  min-height: 440px;
  overflow: hidden;
  border-radius: 18px;
  background: #101828;
}

.camera-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ============================================================
   OVERLAY
============================================================ */

.camera-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.camera-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to bottom,
      rgba(16, 24, 40, 0.58),
      transparent 25%,
      transparent 65%,
      rgba(16, 24, 40, 0.68)
    );
}

/* ============================================================
   FACE GUIDE
============================================================ */

.face-guide {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  width: 245px;
  height: 315px;
  transform: translate(
    -50%,
    -50%
  );
  border: 2px solid rgba(
    255,
    255,
    255,
    0.75
  );
  border-radius: 48% 48% 44% 44%;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.face-guide.ready {
  border-color: #34d399;
  box-shadow:
    0 0 0 4px
      rgba(
        52,
        211,
        153,
        0.12
      ),
    0 0 30px
      rgba(
        52,
        211,
        153,
        0.18
      );
}

.face-guide.capturing {
  border-color: #fbbf24;
  box-shadow:
    0 0 0 4px
      rgba(
        251,
        191,
        36,
        0.12
      );
}

.face-guide.success {
  border-color: #34d399;
}

/* ============================================================
   CORNERS
============================================================ */

.corner {
  position: absolute;
  width: 28px;
  height: 28px;
  border-color: #ffffff;
  border-style: solid;
  border-width: 0;
}

.top-left {
  top: -2px;
  left: -2px;
  border-top-width: 4px;
  border-left-width: 4px;
  border-top-left-radius: 15px;
}

.top-right {
  top: -2px;
  right: -2px;
  border-top-width: 4px;
  border-right-width: 4px;
  border-top-right-radius: 15px;
}

.bottom-left {
  bottom: -2px;
  left: -2px;
  border-bottom-width: 4px;
  border-left-width: 4px;
  border-bottom-left-radius: 15px;
}

.bottom-right {
  right: -2px;
  bottom: -2px;
  border-right-width: 4px;
  border-bottom-width: 4px;
  border-bottom-right-radius: 15px;
}

/* ============================================================
   STATUS
============================================================ */

.camera-status {
  position: absolute;
  z-index: 5;
  top: 18px;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  transform: translateX(-50%);
  border: 1px solid
    rgba(
      255,
      255,
      255,
      0.15
    );
  border-radius: 999px;
  color: #ffffff;
  background: rgba(
    16,
    24,
    40,
    0.65
  );
  backdrop-filter: blur(8px);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #98a2b3;
}

.status-dot.ready {
  background: #34d399;
  box-shadow:
    0 0 0 4px
      rgba(
        52,
        211,
        153,
        0.15
      );
}

.status-dot.capturing {
  background: #fbbf24;
}

/* ============================================================
   CAMERA TIP
============================================================ */

.camera-tip {
  position: absolute;
  z-index: 5;
  right: 20px;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
  color: #ffffff;
}

.camera-tip strong {
  font-size: 15px;
}

.camera-tip span {
  color: rgba(
    255,
    255,
    255,
    0.78
  );
  font-size: 12px;
}

/* ============================================================
   COUNTDOWN
============================================================ */

.countdown {
  position: absolute;
  z-index: 8;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  transform: translate(
    -50%,
    -50%
  );
  border: 3px solid #ffffff;
  border-radius: 50%;
  color: #ffffff;
  background: rgba(
    15,
    118,
    110,
    0.78
  );
  box-shadow:
    0 8px 30px
      rgba(
        0,
        0,
        0,
        0.25
      );
  font-size: 30px;
  font-weight: 800;
}

/* ============================================================
   SUCCESS
============================================================ */

.capture-success {
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  transform: translate(
    -50%,
    -50%
  );
  color: #ffffff;
  text-align: center;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: #ffffff;
  background: #10b981;
  box-shadow:
    0 10px 30px
      rgba(
        16,
        185,
        129,
        0.3
      );
  font-size: 28px;
  font-weight: 800;
}

/* ============================================================
   LOADING
============================================================ */

.camera-loading {
  position: absolute;
  z-index: 20;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  color: #ffffff;
  background: rgba(
    16,
    24,
    40,
    0.65
  );
}

.loading-spinner {
  width: 34px;
  height: 34px;
  border: 3px solid
    rgba(
      255,
      255,
      255,
      0.25
    );
  border-top-color: #ffffff;
  border-radius: 50%;
  animation:
    camera-spin 0.8s linear
    infinite;
}

@keyframes camera-spin {
  to {
    transform: rotate(
      360deg
    );
  }
}

/* ============================================================
   ERROR
============================================================ */

.camera-error {
  position: absolute;
  z-index: 30;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  padding: 30px;
  color: #ffffff;
  background: #101828;
  text-align: center;
}

.camera-error span {
  max-width: 420px;
  color: #d0d5dd;
  font-size: 13px;
}

.retry-button {
  min-height: 40px;
  margin-top: 10px;
  padding: 0 16px;
  border: 0;
  border-radius: 9px;
  color: #ffffff;
  background: #0f766e;
  cursor: pointer;
  font-weight: 700;
}

/* ============================================================
   CONTROLS
============================================================ */

.camera-controls {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.control-button {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
}

.control-button.secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d0d5dd;
  color: #344054;
  background: #ffffff;
}

.control-button.close {
  border: 0;
  color: #ffffff;
  background: #344054;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-icon {
  font-size: 17px;
}

/* ============================================================
   INFORMATION
============================================================ */

.camera-information {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 13px;
  padding: 13px 15px;
  border: 1px solid #e4e7ec;
  border-radius: 11px;
  background: #f9fafb;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667085;
  font-size: 12px;
}

.info-icon {
  color: #0f766e;
  font-weight: 800;
}

/* ============================================================
   CANVAS
============================================================ */

.hidden-canvas {
  display: none;
}

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 600px) {
  .camera-box {
    min-height: 390px;
    border-radius: 14px;
  }

  .face-guide {
    width: 205px;
    height: 270px;
  }

  .camera-status {
    top: 12px;
    max-width: calc(
      100% - 24px
    );
  }

  .camera-controls {
    flex-direction: column;
  }

  .control-button {
    width: 100%;
  }
}
</style>
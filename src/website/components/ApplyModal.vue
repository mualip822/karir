<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isVisible" class="modal-overlay" @click.self="close">
        <div class="modal-container">

          <button
            class="close-btn"
            type="button"
            aria-label="Tutup formulir"
            @click="close"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div class="apply-content">

            <!-- HEADER -->
            <header class="form-header">
              <span class="header-eyebrow">Karir YADIN</span>
              <h1 class="form-title">Formulir Lamaran Kerja</h1>
              <p class="form-subtitle">
                Lengkapi formulir lamaran Anda. Data pribadi otomatis terisi dari profil.
              </p>
            </header>

            <!-- STEPPER -->
            <nav class="stepper" aria-label="Langkah pengisian formulir">
              <ol class="stepper-list">
                <li
                  v-for="(label, index) in stepLabels"
                  :key="index"
                  class="step"
                  :class="{
                    'is-active': currentStep === index + 1,
                    'is-done': currentStep > index + 1,
                  }"
                >
                  <div class="step-marker">
                    <span v-if="currentStep > index + 1" class="step-check">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none"
                        stroke="currentColor" stroke-width="3" stroke-linecap="round"
                        stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span v-else class="step-num">{{ index + 1 }}</span>
                  </div>
                  <span class="step-label">{{ label }}</span>
                </li>
              </ol>

              <div class="stepper-mobile">
                <div class="stepper-mobile__text">
                  <span class="stepper-mobile__current">
                    Langkah {{ currentStep }} dari {{ stepLabels.length }}
                  </span>
                  <strong class="stepper-mobile__label">
                    {{ stepLabels[currentStep - 1] }}
                  </strong>
                </div>
                <div class="stepper-mobile__bar">
                  <div
                    class="stepper-mobile__fill"
                    :style="{ width: stepPercent + '%' }"
                  ></div>
                </div>
              </div>
            </nav>

            <!-- FORM -->
            <form class="apply-form" @submit.prevent="handleSubmit">

              <!-- ============ STEP 1: PRIBADI ============ -->
              <section v-if="currentStep === 1" class="form-section">
                <div class="section-head">
                  <h2 class="section-title">Data Pribadi</h2>
                  <p class="section-sub">
                    Diambil dari profil Anda. Pastikan profil sudah lengkap.
                  </p>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" :value="profileData.nama || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input type="email" :value="profileData.email || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>NIK</label>
                    <input type="text" :value="profileData.nik || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>No. Handphone (WA)</label>
                    <input type="tel" :value="profileData.hp || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Tempat Lahir</label>
                    <input type="text" :value="profileData.tempat_lahir || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Tanggal Lahir</label>
                    <input type="text" :value="profileData.tanggal_lahir || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Jenis Kelamin</label>
                    <input type="text" :value="profileData.jenis_kelamin || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Agama</label>
                    <input type="text" :value="profileData.agama || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Status Pernikahan</label>
                    <input
                      type="text"
                      :value="profileData.status_pernikahan || profileData.status_menikah || ''"
                      readonly
                    />
                  </div>
                  <div class="form-group full-width">
                    <label>Alamat Domisili</label>
                    <textarea :value="profileData.alamat || ''" rows="2" readonly></textarea>
                  </div>
                  <div class="form-group">
                    <label>Provinsi</label>
                    <input type="text" :value="profileData.provinsi || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Kota</label>
                    <input type="text" :value="profileData.kota || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Kecamatan</label>
                    <input type="text" :value="profileData.kecamatan || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Facebook</label>
                    <input type="text" :value="profileData.facebook || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Instagram</label>
                    <input type="text" :value="profileData.instagram || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>LinkedIn</label>
                    <input type="text" :value="profileData.linkedin || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Twitter</label>
                    <input type="text" :value="profileData.twitter || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>TikTok</label>
                    <input type="text" :value="profileData.tiktok || ''" readonly />
                  </div>
                  <div class="form-group full-width">
                    <label>Pendidikan Terakhir</label>
                    <input
                      :value="profileData.pendidikan || profileData.pendidikan_terakhir || ''"
                      readonly
                    />
                  </div>
                </div>
              </section>

              <!-- ============ STEP 2: POSISI ============ -->
              <section v-if="currentStep === 2" class="form-section">
                <div class="section-head">
                  <h2 class="section-title">Posisi yang Dilamar</h2>
                  <p class="section-sub">
                    Pilih kategori, posisi, dan preferensi penempatan.
                  </p>
                </div>

                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Kategori / Divisi <span class="required">*</span></label>
                    <select v-model="selectedCategoryName" required>
                      <option value="">Pilih Kategori</option>
                      <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
                        {{ cat }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group full-width">
                    <label>Pilih Posisi <span class="required">*</span></label>
                    <select
                      v-model="form.lowongan_id"
                      required
                      :disabled="!selectedCategoryName"
                    >
                      <option value="">Pilih Posisi</option>
                      <option v-for="job in filteredJobs" :key="job.id" :value="job.id">
                        {{ job.title }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Lokasi Penempatan</label>
                    <input type="text" :value="selectedJob?.lokasi || ''" readonly />
                  </div>

                  <div class="form-group full-width">
                    <label>Lokasi yang Diharapkan <span class="required">*</span></label>
                    <select v-model="form.expected_location" required>
                      <option value="">Pilih Lokasi yang Diharapkan</option>
                      <option v-for="loc in distinctLocations" :key="loc" :value="loc">
                        {{ loc }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group full-width">
                    <label>Prioritas Pertama <span class="optional">(opsional)</span></label>
                    <select v-model="form.priority_first">
                      <option :value="undefined">-- Pilih prioritas --</option>
                      <option v-for="job in jobs" :key="job.id" :value="job.id">
                        {{ job.title }}
                      </option>
                    </select>
                  </div>
                </div>
              </section>

              <!-- ============ STEP 3: MOTIVASI ============ -->
              <section v-if="currentStep === 3" class="form-section">
                <div class="section-head">
                  <h2 class="section-title">Motivasi & Informasi Tambahan</h2>
                  <p class="section-sub">
                    Ceritakan lebih banyak tentang diri Anda.
                  </p>
                </div>

                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Motivasi Melamar <span class="required">*</span></label>
                    <textarea
                      v-model="form.motivasi"
                      rows="4"
                      placeholder="Ceritakan motivasi Anda..."
                      required
                    ></textarea>
                  </div>

                  <div class="form-group full-width">
                    <label>
                      Seberapa besar motivasi Anda bekerja di lembaga pendidikan
                      Islam? (0–10) <span class="required">*</span>
                    </label>
                    <select v-model="form.motivasi_skala" required>
                      <option value="">Pilih skala</option>
                      <option v-for="n in 11" :key="n - 1" :value="n - 1">
                        {{ n - 1 }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Ekspektasi Gaji <span class="required">*</span></label>
                    <input type="text" v-model="form.gaji" placeholder="Rp ..." required />
                  </div>

                  <div class="form-group full-width">
                    <label>Deskripsi Diri Singkat <span class="required">*</span></label>
                    <textarea
                      v-model="form.deskripsi"
                      rows="3"
                      placeholder="Ceritakan singkat tentang diri Anda..."
                      required
                    ></textarea>
                  </div>

                  <div class="form-group full-width">
                    <label>
                      Jelaskan secara singkat mengenai diri Anda
                      <span class="required">*</span>
                    </label>
                    <textarea v-model="form.jelaskan_diri" rows="3" required></textarea>
                  </div>

                  <div class="form-group full-width">
                    <label>
                      Apakah Anda rutin menyimak kajian Islam?
                      <span class="required">*</span>
                    </label>
                    <div class="radio-row">
                      <label
                        class="radio-pill"
                        :class="{ 'is-selected': form.rutin_kajian === 'iya' }"
                      >
                        <input type="radio" value="iya" v-model="form.rutin_kajian" />
                        <span class="rp-dot"></span>
                        <span class="rp-text">Iya</span>
                      </label>
                      <label
                        class="radio-pill"
                        :class="{ 'is-selected': form.rutin_kajian === 'tidak' }"
                      >
                        <input type="radio" value="tidak" v-model="form.rutin_kajian" />
                        <span class="rp-dot"></span>
                        <span class="rp-text">Tidak</span>
                      </label>
                    </div>
                  </div>

                  <div v-if="form.rutin_kajian === 'iya'" class="form-group full-width">
                    <label>Ustadz yang biasa diikuti kajiannya</label>
                    <textarea v-model="form.ustadz_kajian" rows="2"></textarea>
                  </div>

                  <div class="form-group full-width">
                    <label>
                      Ulama internasional yang Anda ketahui
                      <span class="required">*</span>
                    </label>
                    <input type="text" v-model="form.ulama_internasional" required />
                  </div>

                  <div class="form-group full-width">
                    <label>
                      Ulama Indonesia yang Anda ketahui
                      <span class="required">*</span>
                    </label>
                    <input type="text" v-model="form.ulama_indonesia" required />
                  </div>

                  <div class="form-group full-width">
                    <label>
                      Situs Islam yang biasa jadi referensi
                      <span class="required">*</span>
                    </label>
                    <input type="text" v-model="form.situs_islam" required />
                  </div>

                  <div class="form-group full-width">
                    <label>
                      Stasiun radio/televisi yang biasa diikuti
                      <span class="required">*</span>
                    </label>
                    <input type="text" v-model="form.media_rujukan" required />
                  </div>

                  <div class="form-group full-width">
                    <label>
                      Sumber informasi lowongan <span class="required">*</span>
                    </label>
                    <div class="radio-pills-grid">
                      <label
                        v-for="opt in sumberInfoOptions"
                        :key="opt"
                        class="radio-pill"
                        :class="{ 'is-selected': form.sumber_info === opt }"
                      >
                        <input type="radio" :value="opt" v-model="form.sumber_info" />
                        <span class="rp-dot"></span>
                        <span class="rp-text">{{ opt }}</span>
                      </label>
                    </div>
                    <input
                      v-if="form.sumber_info === 'Lainnya'"
                      v-model="form.sumber_info_lain"
                      placeholder="Sebutkan sumber lainnya"
                      class="mt-2"
                    />
                  </div>

                  <div class="form-group full-width">
                    <label>Hobi <span class="required">*</span></label>
                    <input type="text" v-model="form.hobi" required />
                  </div>

                  <div class="form-group full-width">
                    <label>
                      Sakit berat yang pernah diderita
                      <span class="required">*</span>
                    </label>
                    <textarea v-model="form.riwayat_sakit" rows="2" required></textarea>
                  </div>

                  <div class="form-group">
                    <label>
                      Kapan bisa mulai bekerja? <span class="required">*</span>
                    </label>
                    <input
                      type="text"
                      v-model="form.mulai_kerja"
                      required
                      placeholder="Contoh: Juni 2025"
                    />
                  </div>

                  <div class="form-group full-width">
                    <label>
                      Tanggal siap bekerja <span class="required">*</span>
                    </label>
                    <input type="date" v-model="form.siap_bekerja" required />
                  </div>
                </div>
              </section>

              <!-- ============ STEP 4: UPLOAD ============ -->
              <section v-if="currentStep === 4" class="form-section">
                <div class="section-head">
                  <h2 class="section-title">Upload Dokumen</h2>
                  <p class="section-sub">
                    Format PDF, JPG, PNG (maks. 2 MB). CV, Ijazah, Transkrip wajib.
                  </p>
                </div>

                <div class="upload-grid">
                  <label class="upload-box" :class="{ 'has-file': files.cv }">
                    <span class="upload-icon">
                      <svg v-if="files.cv" viewBox="0 0 24 24" width="20" height="20"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <svg v-else viewBox="0 0 24 24" width="20" height="20"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                    </span>
                    <span class="upload-label">
                      {{ files.cv ? files.cv.name : 'Upload CV' }}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      @change="e => onFileChange(e, 'cv')"
                    />
                  </label>

                  <label class="upload-box" :class="{ 'has-file': files.ijazah }">
                    <span class="upload-icon">
                      <svg v-if="files.ijazah" viewBox="0 0 24 24" width="20" height="20"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <svg v-else viewBox="0 0 24 24" width="20" height="20"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                    </span>
                    <span class="upload-label">
                      {{ files.ijazah ? files.ijazah.name : 'Scan Ijazah' }}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      @change="e => onFileChange(e, 'ijazah')"
                    />
                  </label>

                  <label class="upload-box" :class="{ 'has-file': files.transkrip }">
                    <span class="upload-icon">
                      <svg v-if="files.transkrip" viewBox="0 0 24 24" width="20" height="20"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <svg v-else viewBox="0 0 24 24" width="20" height="20"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                    </span>
                    <span class="upload-label">
                      {{ files.transkrip ? files.transkrip.name : 'Transkrip Nilai' }}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      @change="e => onFileChange(e, 'transkrip')"
                    />
                  </label>

                  <label class="upload-box" :class="{ 'has-file': files.pendukung }">
                    <span class="upload-icon">
                      <svg v-if="files.pendukung" viewBox="0 0 24 24" width="20" height="20"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <svg v-else viewBox="0 0 24 24" width="20" height="20"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </span>
                    <span class="upload-label">
                      {{ files.pendukung ? files.pendukung.name : 'Berkas Pendukung (opsional)' }}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      @change="e => onFileChange(e, 'pendukung')"
                    />
                  </label>
                </div>
              </section>

              <!-- ============ STEP 5: RINGKASAN ============ -->
              <section v-if="currentStep === 5" class="form-section">
                <div class="section-head">
                  <h2 class="section-title">Ringkasan Lamaran</h2>
                  <p class="section-sub">
                    Periksa kembali sebelum mengirim.
                  </p>
                </div>

                <div class="summary-grid">
                  <div class="summary-item">
                    <span class="summary-label">Kategori</span>
                    <span class="summary-value">{{ selectedCategoryName || '-' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Posisi</span>
                    <span class="summary-value">{{ selectedJob?.title || '-' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Lokasi Lowongan</span>
                    <span class="summary-value">{{ selectedJob?.lokasi || '-' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Lokasi Diharapkan</span>
                    <span class="summary-value">{{ form.expected_location || '-' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Ekspektasi Gaji</span>
                    <span class="summary-value">{{ form.gaji || '-' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">CV</span>
                    <span class="summary-value">{{ files.cv?.name || '-' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Ijazah</span>
                    <span class="summary-value">{{ files.ijazah?.name || '-' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Transkrip</span>
                    <span class="summary-value">{{ files.transkrip?.name || '-' }}</span>
                  </div>
                </div>

                <div class="final-note">
                  <p>
                    Dengan mengirim lamaran ini, Anda menyetujui data yang
                    diberikan diproses untuk keperluan rekrutmen.
                  </p>
                </div>
              </section>

              <!-- ACTIONS -->
              <footer class="form-actions">
                <div class="form-actions__inner">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    :class="{ 'is-hidden': currentStep === 1 }"
                    @click="prevStep"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Kembali</span>
                  </button>

                  <span
                    class="form-actions__spacer"
                    :class="{ 'is-hidden': currentStep !== 1 }"
                  ></span>

                  <button
                    type="button"
                    class="btn btn-primary"
                    v-if="currentStep < stepLabels.length"
                    @click="nextStep"
                  >
                    <span>Lanjut</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>

                  <button
                    v-else
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading.submit"
                  >
                    <span v-if="loading.submit" class="spinner"></span>
                    <span v-else>Kirim Lamaran</span>
                  </button>
                </div>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <Transition name="toast">
    <div v-if="toast.message" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import { useApply } from '../composables/useApply';
import type { ApplyPayload } from '../types/apply.types';

/* ============================================================
   PROPS
============================================================ */
const props = defineProps<{
  jobId?: number | null;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();

/* ============================================================
   STATE
============================================================ */
const isVisible = ref(true);
const toast = reactive({
  message: '',
  type: 'success' as 'success' | 'error',
});

/* ============================================================
   COMPOSABLE
============================================================ */
const {
  profile,
  jobs,
  distinctLocations,
  loading,
  loadProfile,
  loadJobs,
  submit,
} = useApply();

/* ============================================================
   PROFILE DATA — Defensive pick dari berbagai bentuk response
============================================================ */
const profileData = computed<Record<string, any>>(() => {
  const src: any = profile.value;
  if (!src || typeof src !== 'object') return {};

  // coba nested umum
  const candidates = [
    src.data?.user,
    src.data?.profile,
    src.data,
    src.user,
    src.profile,
    src,
  ];

  for (const c of candidates) {
    if (
      c &&
      typeof c === 'object' &&
      ('nama' in c || 'email' in c || 'nik' in c)
    ) {
      return c as Record<string, any>;
    }
  }

  return src as Record<string, any>;
});

/* ============================================================
   STEPPER
============================================================ */
const stepLabels = ['Pribadi', 'Posisi', 'Motivasi', 'Berkas', 'Ringkasan'];
const currentStep = ref(1);

const stepPercent = computed(() =>
  Math.round((currentStep.value / stepLabels.length) * 100),
);

/* ============================================================
   OPTIONS
============================================================ */
const sumberInfoOptions = [
  'Facebook',
  'Instagram',
  'Broadcast WA',
  'Telegram',
  'Pegawai YADIN',
  'Lainnya',
];

/* ============================================================
   CATEGORY / JOB
============================================================ */
const selectedCategoryName = ref('');

const uniqueCategories = computed(() => {
  const cats = jobs.value
    .map((job) => job.category_name || job.kategori?.name)
    .filter(Boolean) as string[];
  return [...new Set(cats)];
});

const filteredJobs = computed(() => {
  if (!selectedCategoryName.value) return [];
  return jobs.value.filter(
    (job) =>
      (job.category_name || job.kategori?.name) === selectedCategoryName.value,
  );
});

const selectedJob = computed(() => {
  if (!form.lowongan_id || !jobs.value.length) return null;
  return jobs.value.find((j: any) => j.id == form.lowongan_id) || null;
});

watch(selectedCategoryName, () => {
  form.lowongan_id = '';
});

/* ============================================================
   FORM
============================================================ */
const form = reactive({
  lowongan_id: '' as string | number,
  expected_location: '',
  priority_first: undefined as number | string | undefined,
  motivasi: '',
  motivasi_skala: '' as string | number,
  gaji: '',
  deskripsi: '',
  jelaskan_diri: '',
  rutin_kajian: '',
  ustadz_kajian: '',
  ulama_internasional: '',
  ulama_indonesia: '',
  situs_islam: '',
  media_rujukan: '',
  sumber_info: '',
  sumber_info_lain: '',
  hobi: '',
  riwayat_sakit: '',
  mulai_kerja: '',
  siap_bekerja: '',
});

const files = reactive({
  cv: null as File | null,
  ijazah: null as File | null,
  transkrip: null as File | null,
  pendukung: null as File | null,
});

/* ============================================================
   LABEL MAP
============================================================ */
const fieldLabels: Record<string, string> = {
  expected_location: 'Lokasi yang Diharapkan',
  motivasi: 'Motivasi Melamar',
  motivasi_skala: 'Skala Motivasi',
  gaji: 'Ekspektasi Gaji',
  deskripsi: 'Deskripsi Diri Singkat',
  jelaskan_diri: 'Penjelasan Diri',
  rutin_kajian: 'Rutin Kajian Islam',
  ulama_internasional: 'Ulama Internasional',
  ulama_indonesia: 'Ulama Indonesia',
  situs_islam: 'Situs Islam Referensi',
  media_rujukan: 'Media Rujukan',
  sumber_info: 'Sumber Informasi',
  hobi: 'Hobi',
  riwayat_sakit: 'Riwayat Sakit',
  mulai_kerja: 'Kesiapan Mulai Bekerja',
  siap_bekerja: 'Tanggal Siap Bekerja',
};

/* ============================================================
   HELPERS
============================================================ */
function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.message = msg;
  toast.type = type;
  setTimeout(() => {
    toast.message = '';
  }, 5000);
}

function onFileChange(event: Event, field: keyof typeof files) {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      showToast(`File ${file.name} melebihi 2 MB`, 'error');
      return;
    }
    files[field] = file;
  }
}

/* ============================================================
   VALIDATION
============================================================ */
function validateStep(step: number): boolean {
  if (step === 2) {
    if (!selectedCategoryName.value) {
      showToast('Pilih kategori / divisi terlebih dahulu', 'error');
      return false;
    }
    if (!form.lowongan_id) {
      showToast('Pilih posisi yang dilamar', 'error');
      return false;
    }
    if (!form.expected_location) {
      showToast('Pilih lokasi yang diharapkan', 'error');
      return false;
    }
  }

  if (step === 3) {
    const required: (keyof typeof form)[] = [
      'motivasi',
      'motivasi_skala',
      'gaji',
      'deskripsi',
      'jelaskan_diri',
      'rutin_kajian',
      'ulama_internasional',
      'ulama_indonesia',
      'situs_islam',
      'media_rujukan',
      'sumber_info',
      'hobi',
      'riwayat_sakit',
      'mulai_kerja',
      'siap_bekerja',
    ];
    for (const field of required) {
      if (!form[field]) {
        const label = fieldLabels[field] || field;
        showToast(`${label} wajib diisi`, 'error');
        return false;
      }
    }
    if (form.rutin_kajian === 'iya' && !form.ustadz_kajian) {
      showToast('Sebutkan ustadz yang biasa Anda ikuti kajiannya', 'error');
      return false;
    }
  }

  if (step === 4) {
    if (!files.cv || !files.ijazah || !files.transkrip) {
      showToast('CV, Ijazah, dan Transkrip Nilai wajib diupload', 'error');
      return false;
    }
  }

  return true;
}

/* ============================================================
   NAVIGATION
============================================================ */
function nextStep() {
  if (!validateStep(currentStep.value)) return;
  if (currentStep.value < stepLabels.length) {
    currentStep.value++;
    scrollTop();
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
    scrollTop();
  }
}

function scrollTop() {
  const el = document.querySelector('.apply-content');
  if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   SUBMIT
============================================================ */
async function handleSubmit() {
  if (!validateStep(2)) {
    currentStep.value = 2;
    return;
  }
  if (!validateStep(3)) {
    currentStep.value = 3;
    return;
  }
  if (!validateStep(4)) {
    currentStep.value = 4;
    return;
  }

  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('candidate_token') ||
    '';

  if (!token) {
    showToast('Anda belum login', 'error');
    return;
  }

  const payload: ApplyPayload = {
    lowongan_id: Number(form.lowongan_id),
    expected_location: form.expected_location,
    priority_first: form.priority_first
      ? Number(form.priority_first)
      : undefined,
    motivasi: form.motivasi,
    motivasi_skala: Number(form.motivasi_skala),
    gaji: form.gaji,
    deskripsi: form.deskripsi,
    jelaskan_diri: form.jelaskan_diri,
    rutin_kajian: form.rutin_kajian,
    ustadz_kajian: form.ustadz_kajian,
    ulama_internasional: form.ulama_internasional,
    ulama_indonesia: form.ulama_indonesia,
    situs_islam: form.situs_islam,
    media_rujukan: form.media_rujukan,
    sumber_info: form.sumber_info,
    sumber_info_lain: form.sumber_info_lain,
    hobi: form.hobi,
    riwayat_sakit: form.riwayat_sakit,
    mulai_kerja: form.mulai_kerja,
    siap_bekerja: form.siap_bekerja,
  };

  try {
    await submit(token, payload, {
      cv: files.cv,
      ijazah: files.ijazah,
      transkrip: files.transkrip,
      pendukung: files.pendukung,
    });
    showToast('Lamaran berhasil dikirim!', 'success');
    setTimeout(() => close(), 2000);
  } catch (e: any) {
    showToast(e.message || 'Terjadi kesalahan', 'error');
  }
}

/* ============================================================
   CLOSE
============================================================ */
const close = () => emit('close');

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close();
};

/* ============================================================
   LIFECYCLE
============================================================ */
onMounted(async () => {
  window.addEventListener('keydown', handleEsc);

  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('candidate_token') ||
    '';

  if (!token) {
    showToast('Silakan login terlebih dahulu', 'error');
    return;
  }

  await Promise.all([loadJobs(), loadProfile(token)]);

  if (props.jobId) {
    const jobData = jobs.value.find((j: any) => j.id === props.jobId);
    if (jobData) {
      selectedCategoryName.value =
        jobData.category_name || jobData.kategori?.name || '';
      form.lowongan_id = props.jobId;
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc);
});
</script>

<style scoped>
.modal-overlay {
  --primary: #2f6bff;
  --primary-hover: #2457d6;
  --primary-soft: #eef2ff;
  --primary-border: #dbe3ff;

  --success: #16a34a;
  --success-soft: #ecfdf5;

  --danger: #dc2626;

  --text: #0d1b2a;
  --text-secondary: #4a5568;
  --text-muted: #8b95a5;
  --text-faint: #a8b0bd;

  --surface: #ffffff;
  --surface-muted: #fafbfd;
  --border: #e5e9ef;
  --border-soft: #eef1f6;

  --r-sm: 6px;
  --r-md: 8px;
  --r-lg: 10px;

  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(13, 27, 42, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 820px;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow:
    0 24px 48px -12px rgba(13, 27, 42, 0.18),
    0 12px 24px -12px rgba(13, 27, 42, 0.10);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: var(--text);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: var(--surface-muted);
  border-color: #d5dae2;
  color: var(--text);
}

.apply-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 28px 28px 0;
}

.apply-content::-webkit-scrollbar { width: 6px; }
.apply-content::-webkit-scrollbar-track { background: transparent; }
.apply-content::-webkit-scrollbar-thumb {
  background: #d5dae2;
  border-radius: 999px;
}

.form-header { margin-bottom: 22px; }

.header-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  padding: 4px 10px;
  background: var(--primary-soft);
  border: 1px solid var(--primary-border);
  border-radius: 999px;
  margin-bottom: 12px;
}

.form-title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text);
}

.form-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.stepper {
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  margin-bottom: 20px;
}

.stepper-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
  position: relative;
}

.step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 14px;
  left: calc(50% + 14px);
  right: calc(-50% + 14px);
  height: 2px;
  background: var(--border);
  z-index: -1;
  transition: background 0.3s ease;
}

.step.is-done:not(:last-child)::after {
  background: var(--primary);
}

.step-marker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 2px solid var(--border);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.step.is-active .step-marker {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
  transform: scale(1.05);
}

.step.is-done .step-marker {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
}

.step-num { line-height: 1; }
.step-check { display: flex; line-height: 1; }

.step-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.2;
}

.step.is-active .step-label {
  color: var(--primary);
  font-weight: 600;
}

.step.is-done .step-label {
  color: var(--text-secondary);
}

.stepper-mobile { display: none; }

.stepper-mobile__text {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.stepper-mobile__current {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--text-muted);
}

.stepper-mobile__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}

.stepper-mobile__bar {
  height: 4px;
  background: var(--border-soft);
  border-radius: 999px;
  overflow: hidden;
}

.stepper-mobile__fill {
  height: 100%;
  background: var(--primary);
  border-radius: 999px;
  transition: width 0.35s ease;
}

.apply-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

.section-head {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-soft);
}

.section-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.section-sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.full-width { grid-column: 1 / -1; }

@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.form-group label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
}

.required {
  color: var(--danger);
  font-weight: 700;
  margin-left: 2px;
}

.optional {
  color: var(--text-faint);
  font-weight: 400;
  font-size: 11.5px;
  margin-left: 2px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  min-height: 40px;
  padding: 9px 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  font-family: inherit;
  font-size: 13px;
  color: var(--text);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-group input:hover,
.form-group textarea:hover,
.form-group select:hover {
  border-color: #d5dae2;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.1);
}

.form-group input[readonly],
.form-group textarea[readonly] {
  background: var(--surface-muted);
  color: var(--text);
  cursor: default;
  border-color: var(--border-soft);
  font-weight: 500;
}

.form-group textarea {
  min-height: 72px;
  resize: vertical;
  line-height: 1.5;
}

.mt-2 { margin-top: 8px; }

.radio-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.radio-pills-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.radio-pill {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
}

.radio-pill:hover {
  border-color: #d5dae2;
  background: var(--surface-muted);
}

.radio-pill.is-selected {
  background: var(--primary-soft);
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.08);
}

.radio-pill input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.rp-dot {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  transition: border-color 0.15s ease, border-width 0.15s ease;
}

.radio-pill.is-selected .rp-dot {
  border-color: var(--primary);
  border-width: 5px;
}

.rp-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
}

.radio-pill.is-selected .rp-text {
  color: var(--primary);
  font-weight: 600;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.upload-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 22px 14px;
  border: 1.5px dashed var(--border);
  border-radius: var(--r-md);
  background: var(--surface-muted);
  color: var(--text-muted);
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}

.upload-box:hover {
  border-color: var(--primary-border);
  background: var(--primary-soft);
  color: var(--primary);
}

.upload-box.has-file {
  border-style: solid;
  border-color: var(--success);
  background: var(--success-soft);
  color: var(--success);
}

.upload-box input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-icon { display: inline-flex; }

.upload-label {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
  max-width: 100%;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  background: var(--surface-muted);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-md);
}

.summary-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.summary-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.4;
  word-break: break-word;
}

.final-note {
  padding: 12px 14px;
  background: var(--primary-soft);
  border: 1px solid var(--primary-border);
  border-radius: var(--r-md);
}

.final-note p {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.form-actions {
  position: sticky;
  bottom: 0;
  z-index: 10;
  margin-top: 20px;
  padding: 14px 0;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: saturate(180%) blur(8px);
  -webkit-backdrop-filter: saturate(180%) blur(8px);
  border-top: 1px solid var(--border);
}

.form-actions__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.form-actions__spacer { display: block; flex: 1; }
.is-hidden { visibility: hidden; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 18px;
  border-radius: var(--r-md);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.btn-secondary:hover {
  background: var(--surface-muted);
  border-color: #d5dae2;
}

.btn-primary {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100000;
  padding: 12px 20px;
  border-radius: var(--r-md);
  font-size: 13px;
  font-weight: 500;
  max-width: min(92vw, 420px);
  box-shadow: 0 12px 28px -10px rgba(13, 27, 42, 0.28);
}

.toast.success { background: var(--text); color: #ffffff; }
.toast.error { background: var(--danger); color: #ffffff; }

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }

.modal-enter-from,
.modal-leave-to { opacity: 0; }

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(8px) scale(0.98);
  opacity: 0;
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal-container {
    max-width: 100%;
    max-height: 94vh;
    border-radius: 16px 16px 0 0;
  }

  .apply-content { padding: 22px 16px 0; }
  .form-title { font-size: 19px; }
  .form-subtitle { font-size: 12.5px; }
  .stepper-list { display: none; }
  .stepper-mobile { display: block; }
  .form-section { padding: 16px; }
  .radio-row,
  .radio-pills-grid { grid-template-columns: 1fr; }
  .upload-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .form-actions .btn { flex: 1; }
  .toast {
    left: 12px;
    right: 12px;
    bottom: 12px;
    transform: none;
    max-width: none;
  }
  .toast-enter-from,
  .toast-leave-to { transform: translateY(8px); }
}
</style>
<template>
  <div class="step-form">
    <div class="step-form__container">

      <!-- ==========================================================
           HEADER
      =========================================================== -->
      <header class="form-header">
        <span class="form-eyebrow">Formulir Lamaran</span>
        <h1 class="form-title">Lamar Posisi Ini</h1>
        <p class="form-subtitle">
          Isi data dengan lengkap dan benar. Proses memakan waktu
          sekitar 5–10 menit.
        </p>
      </header>

      <!-- ==========================================================
           STEPPER
      =========================================================== -->
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

        <!-- Mobile compact stepper -->
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

      <!-- ==========================================================
           FORM
      =========================================================== -->
      <form class="form-body" @submit.prevent="handleSubmit">

        <!-- ===================== STEP 1: DATA PRIBADI ===================== -->
        <section v-if="currentStep === 1" class="form-section">
          <div class="section-head">
            <h2 class="section-title">Data Pribadi</h2>
            <p class="section-sub">
              Informasi identitas dan kontak yang dapat dihubungi.
            </p>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="field-label">
                Nama Lengkap <span class="req">*</span>
              </label>
              <input
                v-model="form.fullName"
                type="text"
                class="field-input"
                placeholder="Sesuai KTP"
                required
              />
            </div>

            <div class="field">
              <label class="field-label">
                NIK <span class="req">*</span>
              </label>
              <input
                v-model="form.nik"
                type="text"
                class="field-input"
                placeholder="16 digit angka"
                maxlength="16"
                required
              />
            </div>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="field-label">
                Email <span class="req">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                class="field-input"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div class="field">
              <label class="field-label">
                Nomor HP / WhatsApp <span class="req">*</span>
              </label>
              <input
                v-model="form.phone"
                type="text"
                class="field-input"
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="field-label">
                Jenis Kelamin <span class="req">*</span>
              </label>
              <select v-model="form.gender" class="field-input field-select">
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div class="field">
              <label class="field-label">
                Status Pernikahan <span class="req">*</span>
              </label>
              <select v-model="form.maritalStatus" class="field-input field-select">
                <option value="">Pilih status</option>
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Menikah">Menikah</option>
                <option value="Cerai">Cerai</option>
              </select>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="field-label">Tempat Lahir</label>
              <input
                v-model="form.birthPlace"
                type="text"
                class="field-input"
                placeholder="Kota kelahiran"
              />
            </div>

            <div class="field">
              <label class="field-label">
                Tanggal Lahir <span class="req">*</span>
              </label>
              <input
                type="date"
                v-model="form.birthDate"
                class="field-input"
              />
            </div>
          </div>

          <div class="field">
            <label class="field-label">
              Alamat Lengkap <span class="req">*</span>
            </label>
            <textarea
              rows="3"
              class="field-input field-textarea"
              placeholder="Jalan, nomor rumah, RT/RW"
              v-model="form.address"
            />
          </div>

          <div class="grid grid-3">
            <div class="field">
              <label class="field-label">Provinsi</label>
              <input v-model="form.province" type="text" class="field-input" />
            </div>

            <div class="field">
              <label class="field-label">Kota / Kabupaten</label>
              <input v-model="form.city" type="text" class="field-input" />
            </div>

            <div class="field">
              <label class="field-label">Kode Pos</label>
              <input
                v-model="form.postalCode"
                type="text"
                class="field-input"
                maxlength="5"
              />
            </div>
          </div>
        </section>

        <!-- ===================== STEP 2: DATA LAMARAN ===================== -->
        <section v-if="currentStep === 2" class="form-section">
          <div class="section-head">
            <h2 class="section-title">Data Lamaran</h2>
            <p class="section-sub">
              Posisi dan penempatan yang kamu lamar.
            </p>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="field-label">
                Posisi yang Dilamar <span class="req">*</span>
              </label>
              <input
                v-model="form.position"
                type="text"
                class="field-input"
                placeholder="Contoh: Frontend Developer"
              />
            </div>

            <div class="field">
              <label class="field-label">
                Lembaga / Divisi <span class="req">*</span>
              </label>
              <input
                v-model="form.division"
                type="text"
                class="field-input"
                placeholder="Contoh: Divisi IT"
              />
            </div>
          </div>

          <div class="field">
            <label class="field-label">Lokasi Kerja yang Diinginkan</label>
            <input
              v-model="form.placement"
              type="text"
              class="field-input"
              placeholder="Kota / wilayah penempatan"
            />
          </div>

          <label class="check">
            <input type="checkbox" v-model="form.readyPlacement" />
            <span class="check-box"></span>
            <span class="check-text">
              Bersedia ditempatkan di mana saja
            </span>
          </label>
        </section>

        <!-- ===================== STEP 3: PENDIDIKAN ===================== -->
        <section v-if="currentStep === 3" class="form-section">
          <div class="section-head">
            <h2 class="section-title">Riwayat Pendidikan</h2>
            <p class="section-sub">
              Tambahkan riwayat pendidikan formal dan pesantren.
            </p>
          </div>

          <div
            v-for="(edu, index) in form.educations"
            :key="index"
            class="card"
          >
            <div class="card-head">
              <span class="card-title">Pendidikan #{{ index + 1 }}</span>
              <button
                v-if="form.educations.length > 1"
                type="button"
                class="btn-icon btn-icon-danger"
                aria-label="Hapus pendidikan"
                @click="removeEducation(index)"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>

            <div class="grid grid-2">
              <div class="field">
                <label class="field-label">Jenjang Pendidikan</label>
                <select v-model="edu.level" class="field-input field-select">
                  <option value="">Pilih jenjang</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA/SMK">SMA / SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>

              <div class="field">
                <label class="field-label">Nama Sekolah / Kampus</label>
                <input
                  v-model="edu.institution"
                  type="text"
                  class="field-input"
                  placeholder="Nama institusi"
                />
              </div>
            </div>

            <div class="grid grid-2">
              <div class="field">
                <label class="field-label">Jurusan</label>
                <input
                  v-model="edu.major"
                  type="text"
                  class="field-input"
                  placeholder="Contoh: Teknik Informatika"
                />
              </div>

              <div class="field">
                <label class="field-label">Tahun Lulus</label>
                <input
                  v-model="edu.graduationYear"
                  type="text"
                  class="field-input"
                  placeholder="Contoh: 2020"
                  maxlength="4"
                />
              </div>
            </div>

            <div class="field">
              <label class="field-label">
                Riwayat Pengabdian Pesantren
                <span class="field-hint">(opsional)</span>
              </label>
              <textarea
                rows="3"
                class="field-input field-textarea"
                placeholder="Nama pesantren, tahun, peran"
                v-model="edu.pesantrenExperience"
              />
            </div>
          </div>

          <button type="button" class="btn-dashed" @click="addEducation">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Tambah Pendidikan</span>
          </button>
        </section>

        <!-- ===================== STEP 4: KEISLAMAN ===================== -->
        <section v-if="currentStep === 4" class="form-section">
          <div class="section-head">
            <h2 class="section-title">Keislaman</h2>
            <p class="section-sub">
              Informasi tentang aktivitas keagamaanmu.
            </p>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="field-label">Nilai / Skor Motivasi Keislaman</label>
              <input
                type="number"
                min="1"
                max="100"
                v-model="form.islamicScore"
                class="field-input"
                placeholder="1 – 100"
              />
            </div>

            <div class="field">
              <label class="field-label">Rutin Mengikuti Kajian?</label>
              <select v-model="form.joinKajian" class="field-input field-select">
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label class="field-label">Ustadz yang Diikuti</label>
            <textarea
              rows="3"
              class="field-input field-textarea"
              placeholder="Nama ustadz / pengajar"
              v-model="form.followedUstadz"
            />
          </div>

          <div class="field">
            <label class="field-label">Ulama Internasional yang Diikuti</label>
            <textarea
              rows="3"
              class="field-input field-textarea"
              placeholder="Nama ulama"
              v-model="form.followedScholar"
            />
          </div>

          <div class="field">
            <label class="field-label">Situs Islam yang Sering Dibaca</label>
            <textarea
              rows="3"
              class="field-input field-textarea"
              placeholder="Contoh: situs, blog"
              v-model="form.islamicWebsite"
            />
          </div>

          <div class="field">
            <label class="field-label">Media Islam yang Sering Diikuti</label>
            <textarea
              rows="3"
              class="field-input field-textarea"
              placeholder="Contoh: kanal, akun"
              v-model="form.islamicMedia"
            />
          </div>
        </section>

        <!-- ===================== STEP 5: INFORMASI TAMBAHAN ===================== -->
        <section v-if="currentStep === 5" class="form-section">
          <div class="section-head">
            <h2 class="section-title">Informasi Tambahan</h2>
            <p class="section-sub">
              Ceritakan tentang dirimu dan ekspektasi kerja.
            </p>
          </div>

          <div class="field">
            <label class="field-label">Motivasi Melamar</label>
            <textarea
              rows="4"
              class="field-input field-textarea"
              placeholder="Kenapa kamu tertarik posisi ini?"
              v-model="form.motivation"
            />
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="field-label">Sumber Mengetahui Lowongan</label>
              <input
                v-model="form.jobSource"
                type="text"
                class="field-input"
                placeholder="Contoh: Website, referral"
              />
            </div>

            <div class="field">
              <label class="field-label">Gaji yang Diharapkan</label>
              <input
                v-model="form.salaryExpectation"
                type="text"
                class="field-input"
                placeholder="Contoh: Rp 5.000.000"
              />
            </div>
          </div>

          <div class="field">
            <label class="field-label">Hobi</label>
            <textarea
              rows="2"
              class="field-input field-textarea"
              placeholder="Bisa lebih dari satu"
              v-model="form.hobbies"
            />
          </div>

          <div class="field">
            <label class="field-label">Deskripsi Diri</label>
            <textarea
              rows="4"
              class="field-input field-textarea"
              placeholder="Ceritakan secara singkat"
              v-model="form.selfDescription"
            />
          </div>

          <div class="field">
            <label class="field-label">Kesiapan Bekerja</label>
            <textarea
              rows="2"
              class="field-input field-textarea"
              placeholder="Siap segera, siap ditempatkan, dll"
              v-model="form.workReadiness"
            />
          </div>
        </section>

        <!-- ===================== STEP 6: SOSIAL MEDIA ===================== -->
        <section v-if="currentStep === 6" class="form-section">
          <div class="section-head">
            <h2 class="section-title">Sosial Media</h2>
            <p class="section-sub">
              Tambahkan akun sosial media aktifmu.
            </p>
          </div>

          <div
            v-for="(social, index) in form.socialMedia"
            :key="index"
            class="card"
          >
            <div class="card-head">
              <span class="card-title">Akun #{{ index + 1 }}</span>
              <button
                v-if="form.socialMedia.length > 1"
                type="button"
                class="btn-icon btn-icon-danger"
                aria-label="Hapus akun"
                @click="removeSocial(index)"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>

            <div class="grid grid-2">
              <div class="field">
                <label class="field-label">Platform</label>
                <select v-model="social.platform" class="field-input field-select">
                  <option value="">Pilih platform</option>
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>LinkedIn</option>
                  <option>TikTok</option>
                  <option>YouTube</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div class="field">
                <label class="field-label">Username / URL</label>
                <input
                  v-model="social.username"
                  type="text"
                  class="field-input"
                  placeholder="@username atau link"
                />
              </div>
            </div>
          </div>

          <button type="button" class="btn-dashed" @click="addSocial">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Tambah Sosial Media</span>
          </button>
        </section>

        <!-- ===================== STEP 7: UPLOAD BERKAS ===================== -->
        <section v-if="currentStep === 7" class="form-section">
          <div class="section-head">
            <h2 class="section-title">Upload Berkas</h2>
            <p class="section-sub">
              Upload dokumen pendukung lamaranmu.
            </p>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="field-label">
                CV <span class="req">*</span>
              </label>
              <input
                type="file"
                class="field-input field-file"
                accept=".pdf,.doc,.docx"
              />
            </div>

            <div class="field">
              <label class="field-label">
                KTP <span class="req">*</span>
              </label>
              <input
                type="file"
                class="field-input field-file"
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="field-label">Ijazah</label>
              <input type="file" class="field-input field-file" />
            </div>

            <div class="field">
              <label class="field-label">Transkrip Nilai</label>
              <input type="file" class="field-input field-file" />
            </div>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label class="field-label">Sertifikat</label>
              <input type="file" class="field-input field-file" multiple />
            </div>

            <div class="field">
              <label class="field-label">Dokumen Pendukung Lainnya</label>
              <input type="file" class="field-input field-file" multiple />
            </div>
          </div>

          <label class="check">
            <input type="checkbox" v-model="form.agreement" />
            <span class="check-box"></span>
            <span class="check-text">
              Saya menyetujui data diproses untuk kebutuhan rekrutmen
            </span>
          </label>
        </section>

        <!-- ==========================================================
             ACTIONS
        =========================================================== -->
        <footer class="form-actions">
          <div class="form-actions__inner">
            <button
              type="button"
              v-if="currentStep > 1"
              class="btn btn-secondary"
              @click="prevStep"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Kembali</span>
            </button>

            <span v-else class="form-actions__spacer"></span>

            <button
              type="button"
              v-if="currentStep < 7"
              class="btn btn-primary"
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
              v-if="currentStep === 7"
              type="submit"
              class="btn btn-primary"
            >
              <span>Kirim Lamaran</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </footer>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

/* ============================================================
   STATE
============================================================ */
const currentStep = ref(1);

const stepLabels = [
  'Pribadi',
  'Lamaran',
  'Pendidikan',
  'Keislaman',
  'Tambahan',
  'Sosial Media',
  'Berkas',
];

const stepPercent = computed(() =>
  Math.round((currentStep.value / stepLabels.length) * 100),
);

/* ============================================================
   FORM STATE
============================================================ */
const form = reactive({
  fullName: '',
  nik: '',
  email: '',
  phone: '',
  gender: '',
  maritalStatus: '',
  birthPlace: '',
  birthDate: '',
  address: '',
  province: '',
  city: '',
  postalCode: '',

  position: '',
  division: '',
  placement: '',
  readyPlacement: false,

  educations: [
    {
      level: '',
      institution: '',
      major: '',
      graduationYear: '',
      pesantrenExperience: '',
    },
  ],

  islamicScore: '',
  joinKajian: '',
  followedUstadz: '',
  followedScholar: '',
  islamicWebsite: '',
  islamicMedia: '',

  motivation: '',
  jobSource: '',
  salaryExpectation: '',
  hobbies: '',
  selfDescription: '',
  workReadiness: '',

  socialMedia: [
    {
      platform: '',
      username: '',
    },
  ],

  agreement: false,
});

/* ============================================================
   NAVIGATION
============================================================ */
function nextStep() {
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   DYNAMIC LIST — PENDIDIKAN
============================================================ */
function addEducation() {
  form.educations.push({
    level: '',
    institution: '',
    major: '',
    graduationYear: '',
    pesantrenExperience: '',
  });
}

function removeEducation(index: number) {
  form.educations.splice(index, 1);
}

/* ============================================================
   DYNAMIC LIST — SOSIAL MEDIA
============================================================ */
function addSocial() {
  form.socialMedia.push({
    platform: '',
    username: '',
  });
}

function removeSocial(index: number) {
  form.socialMedia.splice(index, 1);
}

/* ============================================================
   SUBMIT
============================================================ */
function handleSubmit() {
  console.log(form);
  alert('Lamaran berhasil dikirim');
}
</script>

<style scoped>
/* ============================================================
   DESIGN TOKENS
============================================================ */
.step-form {
  --primary: #2f6bff;
  --primary-hover: #2457d6;
  --primary-soft: #eef2ff;
  --primary-border: #dbe3ff;

  --success: #16a34a;
  --success-soft: #ecfdf5;

  --danger: #dc2626;
  --danger-soft: #fef2f2;

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

  min-height: 100vh;
  background: #f6f8fb;
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 32px 20px 120px;
  box-sizing: border-box;
}

.step-form *,
.step-form *::before,
.step-form *::after {
  box-sizing: border-box;
}

.step-form__container {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ============================================================
   HEADER
============================================================ */
.form-header {
  padding: 8px 0 0;
}

.form-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 8px;
}

.form-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text);
}

.form-subtitle {
  margin: 8px 0 0;
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 520px;
}

/* ============================================================
   STEPPER
============================================================ */
.stepper {
  padding: 16px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

.stepper-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
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
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
  font-variant-numeric: tabular-nums;
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

.step-check {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.step-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.2;
  letter-spacing: -0.005em;
}

.step.is-active .step-label {
  color: var(--primary);
  font-weight: 600;
}

.step.is-done .step-label {
  color: var(--text-secondary);
}

/* ============================================================
   STEPPER MOBILE
============================================================ */
.stepper-mobile {
  display: none;
}

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
  letter-spacing: -0.01em;
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
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============================================================
   FORM BODY
============================================================ */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

.section-head {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-soft);
}

.section-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--text);
  line-height: 1.3;
}

.section-sub {
  margin: 6px 0 0;
  font-size: 12.5px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* ============================================================
   GRID
============================================================ */
.grid {
  display: grid;
  gap: 16px;
}

.grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 720px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}

/* ============================================================
   FIELD
============================================================ */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.field-label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: -0.005em;
}

.req {
  color: var(--danger);
  font-weight: 700;
  margin-left: 2px;
}

.field-hint {
  font-weight: 400;
  color: var(--text-faint);
  font-size: 11.5px;
}

.field-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  font-family: inherit;
  font-size: 13px;
  color: var(--text);
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.field-input::placeholder {
  color: var(--text-faint);
}

.field-input:hover {
  border-color: #d5dae2;
}

.field-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.1);
}

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b95a5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  cursor: pointer;
}

.field-textarea {
  height: auto;
  padding: 10px 12px;
  line-height: 1.5;
  resize: vertical;
  min-height: 72px;
}

.field-file {
  height: auto;
  padding: 8px 12px;
  font-size: 12.5px;
  cursor: pointer;
}

.field-file::file-selector-button {
  margin-right: 10px;
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: var(--surface-muted);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.field-file::file-selector-button:hover {
  background: #f0f2f7;
  border-color: #d5dae2;
}

/* ============================================================
   CARD
============================================================ */
.card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  background: var(--surface-muted);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-md);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-soft);
}

.card-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* ============================================================
   BUTTONS
============================================================ */
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
  letter-spacing: -0.005em;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.btn-primary {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.btn-primary:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
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

.btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.btn-icon:hover {
  background: var(--surface-muted);
  border-color: #d5dae2;
  color: var(--text);
}

.btn-icon-danger:hover {
  background: var(--danger-soft);
  border-color: #fecaca;
  color: var(--danger);
}

.btn-dashed {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  align-self: flex-start;
  height: 40px;
  padding: 0 16px;
  border: 1.5px dashed var(--border);
  border-radius: var(--r-md);
  background: transparent;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.btn-dashed:hover {
  background: var(--primary-soft);
  border-color: var(--primary-border);
  color: var(--primary);
}

/* ============================================================
   CHECKBOX
============================================================ */
.check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--surface);
  transition: border-color 0.15s ease, background 0.15s ease;
}

.check:hover {
  border-color: #d5dae2;
}

.check input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.check-box {
  position: relative;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 1.5px solid var(--border);
  border-radius: 5px;
  background: var(--surface);
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
  margin-top: 1px;
}

.check-box::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1.5px;
  width: 5px;
  height: 10px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform 0.15s ease;
}

.check input:checked + .check-box {
  background: var(--primary);
  border-color: var(--primary);
}

.check input:checked + .check-box::after {
  transform: rotate(45deg) scale(1);
}

.check input:focus-visible + .check-box {
  box-shadow: 0 0 0 3px rgba(47, 107, 255, 0.15);
}

.check-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ============================================================
   STICKY ACTIONS
============================================================ */
.form-actions {
  position: sticky;
  bottom: 0;
  z-index: 20;
  margin-top: 4px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(180%) blur(8px);
  -webkit-backdrop-filter: saturate(180%) blur(8px);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: 0 -8px 24px -12px rgba(13, 27, 42, 0.12);
}

.form-actions__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.form-actions__spacer {
  display: block;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 720px) {
  .step-form {
    padding: 20px 14px 100px;
  }

  .step-form__container {
    gap: 18px;
  }

  .form-title { font-size: 22px; }
  .form-subtitle { font-size: 13px; }

  .stepper {
    padding: 14px 16px;
  }

  .stepper-list {
    display: none;
  }

  .stepper-mobile {
    display: block;
  }

  .form-section {
    padding: 18px;
    gap: 16px;
  }

  .section-title { font-size: 15.5px; }
  .section-sub { font-size: 12px; }

  .field-input {
    height: 42px;
    font-size: 14px;
  }

  .field-textarea { min-height: 80px; }

  .card { padding: 14px; }

  .form-actions {
    padding: 10px 12px;
    border-radius: var(--r-md);
  }

  .form-actions__inner {
    gap: 10px;
  }

  .form-actions .btn {
    flex: 1;
    height: 42px;
  }
}

@media (max-width: 420px) {
  .form-title { font-size: 20px; }
  .form-section { padding: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .step-marker,
  .stepper-mobile__fill,
  .field-input,
  .btn,
  .check-box::after {
    transition: none;
  }
}
</style>
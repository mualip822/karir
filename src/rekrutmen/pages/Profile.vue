<template>
  <div class="profile">

    <!-- ==========================================================
         HERO
    =========================================================== -->
    <header class="hero">
      <div class="hero-avatar">
        <img
          :src="previewAvatar || avatarUrl"
          alt="Avatar"
          class="avatar-img"
        />
        <label for="avatar-upload" class="avatar-edit" aria-label="Ganti foto profil">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          class="avatar-input"
          @change="handleAvatar"
        />
      </div>

      <div class="hero-info">
        <div class="hero-name-row">
          <h1 class="hero-name">
            {{ form.nama || 'Nama Pelamar' }}
          </h1>
          <span class="hero-badge">Pelamar Aktif</span>
        </div>
        <p class="hero-email">
          {{ form.email || 'email@example.com' }}
        </p>
        <p class="hero-desc">
          Kelola informasi profil untuk mempermudah proses lamaranmu.
        </p>
      </div>
    </header>

    <!-- ==========================================================
         FORM
    =========================================================== -->
    <form class="profile-form" @submit.prevent="saveProfile">

      <!-- ============ SECTION: DATA PRIBADI ============ -->
      <section class="section">
        <div class="section-head">
          <div class="section-head-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">Informasi Pribadi</h2>
            <p class="section-sub">Data dasar dan identitas Anda</p>
          </div>
        </div>

        <div class="grid grid-3">
          <div class="field">
            <label class="field-label">NIK</label>
            <input
              type="text"
              v-model="form.nik"
              class="field-input"
              placeholder="16 digit angka"
              maxlength="16"
            />
            <span v-if="form.nik && !/^\d+$/.test(form.nik)" class="field-error">
              NIK harus berupa angka saja
            </span>
          </div>

          <div class="field">
            <label class="field-label">Nama Lengkap</label>
            <input
              type="text"
              v-model="form.nama"
              class="field-input"
              placeholder="Sesuai KTP"
            />
          </div>

          <div class="field">
            <label class="field-label">Email</label>
            <input
              type="email"
              v-model="form.email"
              class="field-input"
              placeholder="nama@email.com"
            />
          </div>

          <div class="field">
            <label class="field-label">No HP / WhatsApp</label>
            <input
              type="text"
              v-model="form.hp"
              class="field-input"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div class="field">
            <label class="field-label">Tempat Lahir</label>
            <input
              type="text"
              v-model="form.tempat_lahir"
              class="field-input"
              placeholder="Kota kelahiran"
            />
          </div>

          <div class="field">
            <label class="field-label">Tanggal Lahir</label>
            <input
              type="date"
              v-model="form.tanggal_lahir"
              class="field-input"
            />
          </div>

          <div class="field">
            <label class="field-label">Jenis Kelamin</label>
            <select v-model="form.jenis_kelamin" class="field-input field-select">
              <option value="">Pilih jenis kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div class="field">
            <label class="field-label">Agama</label>
            <input
              type="text"
              v-model="form.agama"
              class="field-input"
              placeholder="Agama"
            />
          </div>

          <div class="field">
            <label class="field-label">Status Pernikahan</label>
            <select v-model="form.status_pernikahan" class="field-input field-select">
              <option value="">Pilih status</option>
              <option value="Belum Menikah">Belum Menikah</option>
              <option value="Menikah">Menikah</option>
              <option value="Duda">Duda</option>
              <option value="Janda">Janda</option>
            </select>
          </div>

          <div class="field">
            <label class="field-label">Pendidikan Terakhir</label>
            <input
              type="text"
              v-model="form.pendidikan"
              class="field-input"
              placeholder="Contoh: S1"
            />
          </div>
        </div>
      </section>

      <!-- ============ SECTION: ALAMAT ============ -->
      <section class="section">
        <div class="section-head">
          <div class="section-head-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">Alamat & Lokasi</h2>
            <p class="section-sub">Domisili dan alamat lengkap</p>
          </div>
        </div>

        <!-- 2 kolom × 2 baris — seimbang -->
        <div class="grid grid-2">
          <div class="field">
            <label class="field-label">Provinsi</label>
            <input
              type="text"
              v-model="form.provinsi"
              class="field-input"
              placeholder="Provinsi"
            />
          </div>

          <div class="field">
            <label class="field-label">Kota / Kabupaten</label>
            <input
              type="text"
              v-model="form.kota"
              class="field-input"
              placeholder="Kota"
            />
          </div>

          <div class="field">
            <label class="field-label">Kecamatan</label>
            <input
              type="text"
              v-model="form.kecamatan"
              class="field-input"
              placeholder="Kecamatan"
            />
          </div>

          <div class="field">
            <label class="field-label">Kode Pos</label>
            <input
              type="text"
              v-model="form.kode_pos"
              class="field-input"
              placeholder="5 digit angka"
              maxlength="5"
            />
            <span
              v-if="form.kode_pos && !/^\d+$/.test(form.kode_pos)"
              class="field-error"
            >
              Kode Pos harus berupa angka
            </span>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Alamat Lengkap</label>
          <textarea
            v-model="form.alamat"
            rows="3"
            class="field-input field-textarea"
            placeholder="Jalan, nomor rumah, RT/RW, kelurahan"
          ></textarea>
        </div>
      </section>

      <!-- ============ SECTION: MEDIA SOSIAL ============ -->
      <section class="section">
        <div class="section-head">
          <div class="section-head-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
            </svg>
          </div>
          <div>
            <h2 class="section-title">Media Sosial</h2>
            <p class="section-sub">Tautan profil profesional & sosial</p>
          </div>
        </div>

        <!-- 3 kolom: baris 1 = 3 field, baris 2 = Twitter 1 + TikTok span 2 -->
        <div class="grid grid-3">
          <div class="field">
            <label class="field-label">Instagram</label>
            <input
              type="text"
              v-model="form.instagram"
              class="field-input"
              placeholder="@username"
            />
          </div>

          <div class="field">
            <label class="field-label">Facebook</label>
            <input
              type="text"
              v-model="form.facebook"
              class="field-input"
              placeholder="facebook.com/..."
            />
          </div>

          <div class="field">
            <label class="field-label">LinkedIn</label>
            <input
              type="text"
              v-model="form.linkedin"
              class="field-input"
              placeholder="linkedin.com/in/..."
            />
          </div>

          <div class="field">
            <label class="field-label">Twitter / X</label>
            <input
              type="text"
              v-model="form.twitter"
              class="field-input"
              placeholder="@username"
            />
          </div>

          <div class="field field-span-2">
            <label class="field-label">TikTok</label>
            <input
              type="text"
              v-model="form.tiktok"
              class="field-input"
              placeholder="@username"
            />
          </div>
        </div>
      </section>

      <!-- ============ ACTIONS ============ -->
      <footer class="actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="store.loading"
        >
          <span v-if="store.loading" class="spinner"></span>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          <span>{{ store.loading ? 'Menyimpan…' : 'Simpan Profil' }}</span>
        </button>
      </footer>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useProfileStore } from '../stores/useProfileStore';

/* ============================================================
   STORE
============================================================ */
const store = useProfileStore();

/* ============================================================
   STATE
============================================================ */
const previewAvatar = ref('');
const avatarFile = ref<File | null>(null);
const avatarUrl = ref(
  'https://ui-avatars.com/api/?name=User&background=2f6bff&color=fff&size=200',
);

const form = reactive({
  nik: '',
  nama: '',
  email: '',
  hp: '',
  alamat: '',
  pendidikan: '',
  avatar: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  agama: '',
  status_pernikahan: '',
  instagram: '',
  facebook: '',
  linkedin: '',
  twitter: '',
  tiktok: '',
  provinsi: '',
  kota: '',
  kecamatan: '',
  kode_pos: '',
});

/* ============================================================
   AVATAR
============================================================ */
function handleAvatar(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert('Ukuran foto melebihi 2 MB');
    return;
  }

  avatarFile.value = file;
  previewAvatar.value = URL.createObjectURL(file);
}

/* ============================================================
   LOAD PROFILE
============================================================ */
async function loadProfile() {
  try {
    const data = await store.fetchProfile();
    if (!data) return;

    Object.assign(form, data);

    if (data.avatar) {
      const API_HOST = (import.meta.env.VITE_API_URL || '').replace('/api', '');
      avatarUrl.value = `${API_HOST}${data.avatar}`;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

/* ============================================================
   SAVE PROFILE
============================================================ */
async function saveProfile() {
  try {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value || '');
    });

    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value);
    }

    await store.saveProfile(formData);
    alert('Profil berhasil disimpan');
    await loadProfile();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    alert('Gagal menyimpan profil');
  }
}

/* ============================================================
   LIFECYCLE
============================================================ */
onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
/* ============================================================
   TOKENS
============================================================ */
.profile {
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

  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

/* ============================================================
   HERO
============================================================ */
.hero {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  flex-wrap: wrap;
}

.hero-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-img {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
  display: block;
  background: var(--surface-muted);
}

.avatar-edit {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid var(--surface);
  transition: background 0.15s ease;
}

.avatar-edit:hover {
  background: var(--primary-hover);
}

.avatar-input {
  display: none;
}

.hero-info {
  flex: 1;
  min-width: 0;
}

.hero-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.hero-name {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--text);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--success-soft);
  color: var(--success);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
}

.hero-email {
  margin: 0 0 4px;
  font-size: 13px;
  color: var(--text-secondary);
  word-break: break-word;
}

.hero-desc {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-muted);
  line-height: 1.5;
  max-width: 640px;
}

/* ============================================================
   FORM
============================================================ */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

.section-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-soft);
}

.section-head-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: var(--primary-soft);
  color: var(--primary);
  border: 1px solid var(--primary-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--text);
  line-height: 1.3;
}

.section-sub {
  margin: 3px 0 0;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
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

.field-span-2 {
  grid-column: span 2;
}

/* Tablet → grid-3 jadi 2 kolom */
@media (max-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* TikTok span 1 saja di tablet */
  .field-span-2 {
    grid-column: span 1;
  }
}

/* Mobile → semua 1 kolom */
@media (max-width: 720px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }

  .field-span-2 {
    grid-column: span 1;
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
  box-sizing: border-box;
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
  min-height: 80px;
}

.field-error {
  font-size: 11.5px;
  color: var(--danger);
  font-weight: 500;
}

/* ============================================================
   ACTIONS
============================================================ */
.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 4px 0 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  padding: 0 22px;
  border-radius: var(--r-md);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.005em;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: all 0.15s ease;
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

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================================
   DESKTOP LEBAR — padding lebih lega
============================================================ */
@media (min-width: 1280px) {
  .hero {
    padding: 28px 32px;
    gap: 28px;
  }

  .avatar-img {
    width: 96px;
    height: 96px;
  }

  .hero-name {
    font-size: 22px;
  }

  .section {
    padding: 28px 32px;
    gap: 22px;
  }
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 720px) {
  .profile { gap: 16px; }

  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 18px;
  }

  .hero-info { width: 100%; }

  .hero-name { font-size: 18px; }

  .section { padding: 18px; }

  .actions .btn {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .field-input,
  .btn,
  .avatar-edit,
  .spinner {
    transition: none;
    animation: none;
  }
}
</style>
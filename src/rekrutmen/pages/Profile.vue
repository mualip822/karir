<template>
  <div class="profile-page">
    <div class="premium-card">
      <!-- Hero Profile Section with Modern Gradient -->
      <div class="profile-hero">
        <div class="hero-bg-blur"></div>
        <div class="hero-content">
          <div class="avatar-hero">
            <div class="avatar-wrapper-modern">
              <img :src="previewAvatar || avatarUrl" class="avatar-hero-img" alt="Profile Avatar" />
              <label for="avatar-upload-hero" class="avatar-edit-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.46V20.5C3 21.05 3.45 21.5 4 21.5H7.04C7.29 21.5 7.53 21.41 7.71 21.23L18.81 10.13L13.88 5.2L2.78 16.3C2.6 16.48 2.51 16.72 2.51 16.97L3 17.46ZM20.71 5.63L18.38 3.3C17.99 2.91 17.36 2.91 16.97 3.3L15.13 5.14L20.06 10.07L21.9 8.23C22.29 7.84 22.29 7.21 21.9 6.82L20.71 5.63Z" fill="white"/>
                </svg>
              </label>
            </div>
            <input type="file" id="avatar-upload-hero" accept="image/*" @change="handleAvatar" style="display: none" />
            <div v-if="avatarFile" class="avatar-filename-modern">{{ avatarFile.name }}</div>
          </div>
          <div class="hero-info">
            <div class="hero-name-section">
              <h1 class="hero-name">{{ form.nama || 'Nama Pelamar' }}</h1>
              <span class="badge-active">Pelamar Aktif</span>
            </div>
            <p class="hero-email">{{ form.email || 'email@example.com' }}</p>
            <p class="hero-desc">Kelola informasi profil Anda untuk melamar pekerjaan dengan lebih mudah.</p>
          </div>
        </div>
      </div>

      <!-- Form Sections -->
      <form @submit.prevent="saveProfile" class="premium-form">
        <!-- Section 1: Informasi Pribadi -->
        <div class="form-section-modern">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#2563eb"/>
              </svg>
            </div>
            <div>
              <h3 class="section-title">Informasi Pribadi</h3>
              <p class="section-subtitle">Data dasar dan identitas Anda</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="input-group-modern">
              <label>NIK (16 digit angka)</label>
              <input 
                type="text" 
                v-model="form.nik" 
                placeholder="Masukkan 16 digit NIK" 
                maxlength="16"
              />
              <span v-if="form.nik && !/^\d+$/.test(form.nik)" class="error-message">
                ⚠️ NIK harus berupa angka saja
              </span>
            </div>
            <div class="input-group-modern">
              <label>Nama Lengkap</label>
              <input type="text" v-model="form.nama" placeholder="Nama lengkap sesuai KTP" />
            </div>
            <div class="input-group-modern">
              <label>Email</label>
              <input type="email" v-model="form.email" placeholder="email@perusahaan.com" />
            </div>
            <div class="input-group-modern">
              <label>No HP</label>
              <input type="text" v-model="form.hp" placeholder="Nomor telepon aktif" />
            </div>
            <div class="input-group-modern">
              <label>Tempat Lahir</label>
              <input type="text" v-model="form.tempat_lahir" placeholder="Kota kelahiran" />
            </div>
            <div class="input-group-modern">
              <label>Tanggal Lahir</label>
              <input type="date" v-model="form.tanggal_lahir" />
            </div>
            <div class="input-group-modern">
              <label>Jenis Kelamin</label>
              <select v-model="form.jenis_kelamin">
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div class="input-group-modern">
              <label>Agama</label>
              <input type="text" v-model="form.agama" placeholder="Agama" />
            </div>
            <div class="input-group-modern">
              <label>Status Pernikahan</label>
              <select v-model="form.status_pernikahan">
                <option value="">Pilih Status</option>
                <option value="Menikah">Menikah</option>
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Duda">Duda</option>
                <option value="Janda">Janda</option>
              </select>
            </div>
            <div class="input-group-modern">
              <label>Pendidikan Terakhir</label>
              <input type="text" v-model="form.pendidikan" placeholder="S1, S2, D3, dll" />
            </div>
          </div>
        </div>

        <!-- Section 2: Alamat & Lokasi -->
        <div class="form-section-modern">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#2563eb"/>
              </svg>
            </div>
            <div>
              <h3 class="section-title">Alamat & Lokasi</h3>
              <p class="section-subtitle">Domisili dan alamat lengkap</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="input-group-modern">
              <label>Provinsi</label>
              <input type="text" v-model="form.provinsi" placeholder="Provinsi" />
            </div>
            <div class="input-group-modern">
              <label>Kota/Kabupaten</label>
              <input type="text" v-model="form.kota" placeholder="Kota" />
            </div>
            <div class="input-group-modern">
              <label>Kecamatan</label>
              <input type="text" v-model="form.kecamatan" placeholder="Kecamatan" />
            </div>
            <div class="input-group-modern">
              <label>Kode Pos (5 digit angka)</label>
              <input 
                type="text" 
                v-model="form.kode_pos" 
                placeholder="Kode pos" 
                maxlength="5"
              />
              <span v-if="form.kode_pos && !/^\d+$/.test(form.kode_pos)" class="error-message">
                ⚠️ Kode Pos harus berupa angka saja
              </span>
            </div>
          </div>
          <div class="input-group-modern full-width">
            <label>Alamat Lengkap</label>
            <textarea v-model="form.alamat" rows="4" placeholder="Jalan, RT/RW, Kelurahan/Desa"></textarea>
          </div>
        </div>

        <!-- Section 3: Media Sosial -->
        <div class="form-section-modern">
          <div class="section-header">
            <div class="section-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" fill="#2563eb"/>
              </svg>
            </div>
            <div>
              <h3 class="section-title">Media Sosial</h3>
              <p class="section-subtitle">Tautan profil profesional & sosial</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="input-group-modern">
              <label>Instagram</label>
              <input type="text" v-model="form.instagram" placeholder="@username" />
            </div>
            <div class="input-group-modern">
              <label>Facebook</label>
              <input type="text" v-model="form.facebook" placeholder="facebook.com/..." />
            </div>
            <div class="input-group-modern">
              <label>LinkedIn</label>
              <input type="text" v-model="form.linkedin" placeholder="linkedin.com/in/..." />
            </div>
            <div class="input-group-modern">
              <label>Twitter / X</label>
              <input type="text" v-model="form.twitter" placeholder="@username" />
            </div>
            <div class="input-group-modern">
              <label>TikTok</label>
              <input type="text" v-model="form.tiktok" placeholder="@username" />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons-modern">
          <button type="submit" class="btn-save-premium" :disabled="store.loading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
              <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12Z" fill="currentColor"/>
            </svg>
            {{ store.loading ? "Menyimpan..." : "Simpan Profile" }}
          </button>
          <!-- <button type="button" class="btn-delete-premium" @click="deleteProfile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
            </svg>
            Hapus Profile
          </button> -->
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useProfileStore } from "../stores/useProfileStore";

const store = useProfileStore();
const previewAvatar = ref("");
const avatarFile = ref<File | null>(null);
const avatarUrl = ref("https://ui-avatars.com/api/?name=User&background=2563eb&color=fff");

const form = reactive({
  nik: "",
  nama: "",
  email: "",
  hp: "",
  alamat: "",
  pendidikan: "",
  avatar: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "",
  agama: "",
  status_pernikahan: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  twitter: "",
  tiktok: "",
  provinsi: "",
  kota: "",
  kecamatan: "",
  kode_pos: "",
});

function handleAvatar(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  avatarFile.value = file;
  previewAvatar.value = URL.createObjectURL(file);
}

async function loadProfile() {
  try {
    const data = await store.fetchProfile();
    if (!data) return;
    Object.assign(form, data);
    if (data.avatar) {
      const API_HOST = import.meta.env.VITE_API_URL.replace("/api", "");

avatarUrl.value = `${API_HOST}${data.avatar}`;
    }
  } catch (error) {
    console.log(error);
  }
}

async function saveProfile() {
  try {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value || "");
    });
    if (avatarFile.value) {
      formData.append("avatar", avatarFile.value);
    }
    await store.saveProfile(formData);
    alert("Profile berhasil disimpan");
    await loadProfile();
  } catch (error) {
    console.log(error);
    alert("Gagal menyimpan profile");
  }
}

async function deleteProfile() {
  const confirmed = confirm("Yakin hapus profile?");
  if (!confirmed) return;
  try {
    await store.deleteProfile();
    alert("Profile berhasil dihapus");
    location.reload();
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.profile-page {
  min-height: 100vh;
  padding: 40px 32px;
  background: #f5f7fb;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.premium-card {
  max-width: 1280px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  transition: all 0.2s ease;
}

/* Hero Section */
.profile-hero {
  position: relative;
  background: linear-gradient(135deg, #f0f4fe 0%, #ffffff 100%);
  padding: 40px 40px 32px 40px;
  border-bottom: 1px solid rgba(37, 99, 235, 0.08);
  overflow: hidden;
}

.hero-bg-blur {
  position: absolute;
  top: -40%;
  right: -20%;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
}

.avatar-hero {
  flex-shrink: 0;
}

.avatar-wrapper-modern {
  position: relative;
  width: 112px;
  height: 112px;
}

.avatar-hero-img {
  width: 112px;
  height: 112px;
  border-radius: 56px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.12);
  transition: all 0.25s ease;
}

.avatar-wrapper-modern:hover .avatar-hero-img {
  transform: scale(1.02);
  box-shadow: 0 16px 28px -8px rgba(0, 0, 0, 0.15);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #2563eb;
  border-radius: 32px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  border: 2px solid white;
}

.avatar-edit-btn:hover {
  background: #1d4ed8;
  transform: scale(1.05);
}

.avatar-filename-modern {
  margin-top: 12px;
  font-size: 12px;
  color: #4b5563;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 40px;
  text-align: center;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-info {
  flex: 1;
}

.hero-name-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.hero-name {
  font-size: 28px;
  font-weight: 700;
  color: #0a2540;
  letter-spacing: -0.3px;
  margin: 0;
}

.badge-active {
  background: #e6f7ec;
  color: #0e7b32;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 40px;
  letter-spacing: 0.2px;
}

.hero-email {
  font-size: 16px;
  color: #5c6f87;
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 14px;
  color: #6c7a91;
  max-width: 500px;
}

/* Premium Form */
.premium-form {
  padding: 0;
}

.form-section-modern {
  padding: 32px 40px;
  border-bottom: 1px solid #eff3f8;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}

.section-icon-wrapper {
  width: 44px;
  height: 44px;
  background: #eff4fe;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.2px;
}

.section-subtitle {
  font-size: 13px;
  color: #6c7a91;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px 28px;
}

.input-group-modern {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group-modern label {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #4b5a72;
}

.input-group-modern input,
.input-group-modern select,
.input-group-modern textarea {
  padding: 14px 18px;
  border-radius: 16px;
  border: 1.5px solid #e5e9f0;
  background: #ffffff;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
  outline: none;
  color: #0f172a;
}

.input-group-modern input:focus,
.input-group-modern select:focus,
.input-group-modern textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}

.input-group-modern input::placeholder,
.input-group-modern select::placeholder,
.input-group-modern textarea::placeholder {
  color: #9aa6b9;
}

.error-message {
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.full-width {
  grid-column: 1 / -1;
  margin-top: 4px;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

/* Action Buttons */
.action-buttons-modern {
  padding: 32px 40px 40px 40px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  background: #ffffff;
}

.btn-save-premium {
  background: linear-gradient(105deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 44px;
  font-weight: 600;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
}

.btn-save-premium:hover:not(:disabled) {
  background: linear-gradient(105deg, #1d4ed8 0%, #1e3a8a 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3);
}

.btn-save-premium:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-delete-premium {
  background: #ffffff;
  color: #dc2626;
  border: 1.5px solid #fee2e2;
  padding: 14px 32px;
  border-radius: 44px;
  font-weight: 600;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fef2f2;
}

.btn-delete-premium:hover {
  background: #fee2e2;
  border-color: #fecaca;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(220, 38, 38, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-page {
    padding: 20px 16px;
  }

  .profile-hero {
    padding: 28px 24px;
  }

  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }

  .hero-name-section {
    justify-content: center;
  }

  .hero-desc {
    margin-left: auto;
    margin-right: auto;
  }

  .form-section-modern {
    padding: 28px 24px;
  }

  .action-buttons-modern {
    padding: 24px 24px 32px;
    flex-direction: column;
  }

  .btn-save-premium,
  .btn-delete-premium {
    width: 100%;
    justify-content: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .hero-name {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .avatar-wrapper-modern {
    width: 96px;
    height: 96px;
  }

  .avatar-hero-img {
    width: 96px;
    height: 96px;
  }

  .avatar-edit-btn {
    width: 32px;
    height: 32px;
  }
}
</style>
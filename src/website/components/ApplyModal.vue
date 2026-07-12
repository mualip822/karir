<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isVisible" class="modal-overlay" @click.self="close">
        <div class="modal-container">
          <button class="close-btn" @click="close">&times;</button>

          <div class="apply-form-content">
            <!-- Header Modern -->
            <header class="form-header">
              <div class="header-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <span class="header-badge">Karir YADIN</span>
              <h1>Formulir Lamaran Kerja</h1>
              <p>Lengkapi formulir lamaran Anda. Data pribadi otomatis terisi dari profil.</p>
              <div class="progress-area">
                <div class="progress-bar-track">
                  <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ progress }}% Lengkap</span>
              </div>
            </header>

            <form class="apply-form" @submit.prevent="handleSubmit">
              <!-- 1. DATA PRIBADI -->
              <section class="form-card">
                <div class="card-heading">
                  <h2>Data Pribadi</h2>
                  <p>Diambil dari profil Anda. Pastikan profil sudah lengkap.</p>
                </div>
                <div class="form-grid">
                  <div class="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" :value="profile?.nama || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input type="email" :value="profile?.email || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>NIK</label>
                    <input type="text" :value="profile?.nik || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>No. Handphone (WA)</label>
                    <input type="tel" :value="profile?.hp || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Tempat Lahir</label>
                    <input type="text" :value="profile?.tempat_lahir || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Tanggal Lahir</label>
                    <input type="text" :value="profile?.tanggal_lahir || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Jenis Kelamin</label>
                    <input type="text" :value="profile?.jenis_kelamin || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Agama</label>
                    <input type="text" :value="profile?.agama || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Status Pernikahan</label>
                    <input type="text" :value="profile?.status_pernikahan || ''" readonly />
                  </div>
                  <div class="form-group full-width">
                    <label>Alamat Domisili</label>
                    <textarea :value="profile?.alamat || ''" rows="2" readonly></textarea>
                  </div>
                  <div class="form-group">
                    <label>Provinsi</label>
                    <input type="text" :value="profile?.provinsi || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Kota</label>
                    <input type="text" :value="profile?.kota || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Kecamatan</label>
                    <input type="text" :value="profile?.kecamatan || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Facebook</label>
                    <input type="text" :value="profile?.facebook || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Instagram</label>
                    <input type="text" :value="profile?.instagram || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>LinkedIn</label>
                    <input type="text" :value="profile?.linkedin || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>Twitter</label>
                    <input type="text" :value="profile?.twitter || ''" readonly />
                  </div>
                  <div class="form-group">
                    <label>TikTok</label>
                    <input type="text" :value="profile?.tiktok || ''" readonly />
                  </div>
                </div>
              </section>

              <!-- 2. PENDIDIKAN -->
              <section class="form-card">
                <div class="card-heading">
                  <h2>Pendidikan Terakhir</h2>
                  <p>Data dari profil Anda.</p>
                </div>
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Pendidikan Terakhir</label>
                    <input :value="profile?.pendidikan || ''" readonly />
                  </div>
                </div>
              </section>

              <!-- 3. POSISI YANG DILAMAR -->
              <section class="form-card">
                <div class="card-heading">
                  <h2>Posisi yang Dilamar</h2>
                  <p>Pilih kategori, posisi, dan preferensi penempatan.</p>
                </div>
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Kategori / Divisi <span class="required">*</span></label>
                    <select v-model="selectedCategoryName" required>
                      <option value="">Pilih Kategori</option>
                      <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>
                  <div class="form-group full-width">
                    <label>Pilih Posisi <span class="required">*</span></label>
                    <select v-model="form.lowongan_id" required :disabled="!selectedCategoryName">
                      <option value="">Pilih Posisi</option>
                      <option v-for="job in filteredJobs" :key="job.id" :value="job.id">{{ job.title }}</option>
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
                      <option v-for="loc in distinctLocations" :key="loc" :value="loc">{{ loc }}</option>
                    </select>
                  </div>
                  <div class="form-group full-width">
                    <label>Prioritas Pertama (opsional)</label>
                    <select v-model="form.priority_first">
                      <option :value="undefined">-- Pilih prioritas --</option>
                      <option v-for="job in jobs" :key="job.id" :value="job.id">{{ job.title }}</option>
                    </select>
                  </div>
                </div>
              </section>

              <!-- 4. MOTIVASI & INFORMASI TAMBAHAN -->
              <section class="form-card">
                <div class="card-heading">
                  <h2>Motivasi & Informasi Tambahan</h2>
                  <p>Ceritakan lebih banyak tentang diri Anda.</p>
                </div>
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Motivasi Melamar <span class="required">*</span></label>
                    <textarea v-model="form.motivasi" rows="4" placeholder="Ceritakan motivasi Anda..." required></textarea>
                  </div>
                  <div class="form-group full-width">
                    <label>Seberapa besar motivasi Anda bekerja di lembaga pendidikan Islam? (0-10) <span class="required">*</span></label>
                    <select v-model="form.motivasi_skala" required>
                      <option value="">Pilih skala</option>
                      <option v-for="n in 11" :key="n-1" :value="n-1">{{ n-1 }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Ekspektasi Gaji <span class="required">*</span></label>
                    <input type="text" v-model="form.gaji" placeholder="Rp ..." required />
                  </div>
                  <div class="form-group full-width">
                    <label>Deskripsi Diri Singkat <span class="required">*</span></label>
                    <textarea v-model="form.deskripsi" rows="3" placeholder="Ceritakan singkat tentang diri Anda..." required></textarea>
                  </div>
                  <div class="form-group full-width">
                    <label>Jelaskan secara singkat mengenai diri Anda <span class="required">*</span></label>
                    <textarea v-model="form.jelaskan_diri" rows="3" required></textarea>
                  </div>
                  <div class="form-group full-width">
                    <label>Apakah Anda rutin menyimak kajian Islam? <span class="required">*</span></label>
                    <div class="radio-group">
                      <label class="radio-label"><input type="radio" value="iya" v-model="form.rutin_kajian" /> Iya</label>
                      <label class="radio-label"><input type="radio" value="tidak" v-model="form.rutin_kajian" /> Tidak</label>
                    </div>
                  </div>
                  <div class="form-group full-width" v-if="form.rutin_kajian === 'iya'">
                    <label>Ustadz yang biasa diikuti kajiannya</label>
                    <textarea v-model="form.ustadz_kajian" rows="2"></textarea>
                  </div>
                  <div class="form-group full-width">
                    <label>Ulama internasional yang Anda ketahui <span class="required">*</span></label>
                    <input type="text" v-model="form.ulama_internasional" required />
                  </div>
                  <div class="form-group full-width">
                    <label>Ulama Indonesia yang Anda ketahui <span class="required">*</span></label>
                    <input type="text" v-model="form.ulama_indonesia" required />
                  </div>
                  <div class="form-group full-width">
                    <label>Situs Islam yang biasa jadi referensi <span class="required">*</span></label>
                    <input type="text" v-model="form.situs_islam" required />
                  </div>
                  <div class="form-group full-width">
                    <label>Stasiun radio/televisi yang biasa diikuti <span class="required">*</span></label>
                    <input type="text" v-model="form.media_rujukan" required />
                  </div>
                  <div class="form-group full-width">
                    <label>Sumber informasi lowongan <span class="required">*</span></label>
                    <div class="radio-group vertical">
                      <label class="radio-label"><input type="radio" value="Facebook" v-model="form.sumber_info" /> Facebook</label>
                      <label class="radio-label"><input type="radio" value="Instagram" v-model="form.sumber_info" /> Instagram</label>
                      <label class="radio-label"><input type="radio" value="Broadcast WA" v-model="form.sumber_info" /> Broadcast WA</label>
                      <label class="radio-label"><input type="radio" value="Telegram" v-model="form.sumber_info" /> Telegram</label>
                      <label class="radio-label"><input type="radio" value="Pegawai YADIN" v-model="form.sumber_info" /> Pegawai YADIN</label>
                      <label class="radio-label"><input type="radio" value="Lainnya" v-model="form.sumber_info" /> Lainnya</label>
                    </div>
                    <input v-if="form.sumber_info === 'Lainnya'" v-model="form.sumber_info_lain" placeholder="Sebutkan sumber lainnya" class="mt-2" />
                  </div>
                  <div class="form-group full-width">
                    <label>Hobi <span class="required">*</span></label>
                    <input type="text" v-model="form.hobi" required />
                  </div>
                  <div class="form-group full-width">
                    <label>Sakit berat yang pernah diderita <span class="required">*</span></label>
                    <textarea v-model="form.riwayat_sakit" rows="2" required></textarea>
                  </div>
                  <div class="form-group">
                    <label>Kapan bisa mulai bekerja? <span class="required">*</span></label>
                    <input type="text" v-model="form.mulai_kerja" required placeholder="Contoh: Juni 2025" />
                  </div>
                  <div class="form-group full-width">
                    <label>Tanggal siap bekerja <span class="required">*</span></label>
                    <input type="date" v-model="form.siap_bekerja" required />
                  </div>
                </div>
              </section>

              <!-- 5. UPLOAD DOKUMEN -->
              <section class="form-card">
                <div class="card-heading">
                  <h2>Upload Dokumen</h2>
                  <p>Format PDF, JPG, PNG (maks. 2MB). CV, Ijazah, Transkrip wajib.</p>
                </div>
                <div class="upload-grid">
                  <label class="upload-box" :class="{ 'has-file': files.cv }">
                    <span class="upload-icon">{{ files.cv ? '✅' : '📄' }}</span>
                    <span>{{ files.cv ? files.cv.name : 'Upload CV' }}</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="e => onFileChange(e, 'cv')" />
                  </label>
                  <label class="upload-box" :class="{ 'has-file': files.ijazah }">
                    <span class="upload-icon">{{ files.ijazah ? '✅' : '📄' }}</span>
                    <span>{{ files.ijazah ? files.ijazah.name : 'Scan Ijazah' }}</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="e => onFileChange(e, 'ijazah')" />
                  </label>
                  <label class="upload-box" :class="{ 'has-file': files.transkrip }">
                    <span class="upload-icon">{{ files.transkrip ? '✅' : '📄' }}</span>
                    <span>{{ files.transkrip ? files.transkrip.name : 'Transkrip Nilai' }}</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="e => onFileChange(e, 'transkrip')" />
                  </label>
                  <label class="upload-box" :class="{ 'has-file': files.pendukung }">
                    <span class="upload-icon">{{ files.pendukung ? '✅' : '📎' }}</span>
                    <span>{{ files.pendukung ? files.pendukung.name : 'Berkas Pendukung (opsional)' }}</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="e => onFileChange(e, 'pendukung')" />
                  </label>
                </div>
              </section>

              <!-- 6. RINGKASAN LAMARAN -->
              <section class="form-card summary-card">
                <div class="card-heading">
                  <h2>Ringkasan Lamaran</h2>
                  <p>Periksa kembali sebelum mengirim.</p>
                </div>
                <div class="summary-grid">
                  <div class="summary-item"><span class="summary-label">Kategori</span><span class="summary-value">{{ selectedCategoryName || '-' }}</span></div>
                  <div class="summary-item"><span class="summary-label">Posisi</span><span class="summary-value">{{ selectedJob?.title || '-' }}</span></div>
                  <div class="summary-item"><span class="summary-label">Lokasi Lowongan</span><span class="summary-value">{{ selectedJob?.lokasi || '-' }}</span></div>
                  <div class="summary-item"><span class="summary-label">Lokasi Diharapkan</span><span class="summary-value">{{ form.expected_location || '-' }}</span></div>
                  <div class="summary-item"><span class="summary-label">CV</span><span class="summary-value">{{ files.cv?.name || '-' }}</span></div>
                  <div class="summary-item"><span class="summary-label">Ijazah</span><span class="summary-value">{{ files.ijazah?.name || '-' }}</span></div>
                  <div class="summary-item"><span class="summary-label">Transkrip</span><span class="summary-value">{{ files.transkrip?.name || '-' }}</span></div>
                </div>
              </section>
            </form>

            <!-- Sticky Footer -->
            <div class="sticky-footer">
              <button type="button" class="btn-cancel" @click="close">Batal</button>
              <button type="button" class="btn-submit" :disabled="loading.submit" @click="handleSubmit">
                <span v-if="loading.submit" class="spinner"></span>
                <span v-else>Kirim Lamaran</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Toast -->
  <div v-if="toast.message" class="toast" :class="toast.type">{{ toast.message }}</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useApply } from '../composables/useApply'
import type { ApplyPayload } from '../types/apply.types'

const props = defineProps<{
  jobId?: number | null
}>()
const emit = defineEmits<{ (e: 'close'): void }>()

const isVisible = ref(true)
const toast = reactive({ message: '', type: 'success' })

const { profile, jobs, distinctLocations, loading, error, loadProfile, loadJobs, submit } = useApply()

// State untuk kategori yang dipilih
const selectedCategoryName = ref('')

// Computed: daftar kategori unik dari lowongan
const uniqueCategories = computed(() => {
  const cats = jobs.value.map(job => job.category_name || job.kategori?.name).filter(Boolean) as string[]
  return [...new Set(cats)]
})

// Computed: daftar lowongan yang sesuai kategori terpilih
const filteredJobs = computed(() => {
  if (!selectedCategoryName.value) return []
  return jobs.value.filter(job => (job.category_name || job.kategori?.name) === selectedCategoryName.value)
})

// Computed: lowongan yang dipilih berdasarkan lowongan_id
const selectedJob = computed(() => {
  if (!form.lowongan_id || !jobs.value.length) return null
  return jobs.value.find((j: any) => j.id == form.lowongan_id) || null
})

// Reset posisi saat kategori berubah
watch(selectedCategoryName, () => {
  form.lowongan_id = ''
})

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
})

const files = reactive({
  cv: null as File | null,
  ijazah: null as File | null,
  transkrip: null as File | null,
  pendukung: null as File | null,
})

// Label mapping untuk validasi ramah
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
}

const progress = computed(() => {
  let sections = 0
  const total = 5

  // 1. Data pribadi: ada nama
  if (profile.value?.nama) sections++

  // 2. Pendidikan
  if (profile.value?.pendidikan) sections++

  // 3. Posisi: kategori dipilih, posisi dipilih, expected_location terisi
  if (selectedCategoryName.value && form.lowongan_id && form.expected_location) sections++

  // 4. Motivasi: cek semua wajib kecuali kondisional
  const motivasiFields = [
    form.motivasi, form.motivasi_skala, form.gaji, form.deskripsi,
    form.jelaskan_diri, form.rutin_kajian, form.ulama_internasional,
    form.ulama_indonesia, form.situs_islam, form.media_rujukan,
    form.sumber_info, form.hobi, form.riwayat_sakit, form.mulai_kerja, form.siap_bekerja
  ]
  const motivasiValid = motivasiFields.every(f => f !== '' && f !== null && f !== undefined)
  if (form.rutin_kajian === 'iya' && !form.ustadz_kajian) {
    // belum lengkap
  } else if (motivasiValid) {
    sections++
  }

  // 5. Dokumen wajib
  if (files.cv && files.ijazah && files.transkrip) sections++

  return Math.round((sections / total) * 100)
})

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.message = msg
  toast.type = type
  setTimeout(() => { toast.message = '' }, 5000)
}

function onFileChange(event: Event, field: keyof typeof files) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    const file = input.files[0]
    if (file.size > 2 * 1024 * 1024) {
      showToast(`File ${file.name} melebihi 2MB`, 'error')
      return
    }
    files[field] = file
  }
}

async function handleSubmit() {
  // Validasi field wajib
  if (!selectedCategoryName.value) {
    showToast('Kategori / Divisi wajib dipilih', 'error')
    return
  }
  const requiredFields: (keyof typeof form)[] = [
    'expected_location', 'motivasi', 'motivasi_skala', 'gaji', 'deskripsi', 'jelaskan_diri',
    'rutin_kajian', 'ulama_internasional', 'ulama_indonesia', 'situs_islam', 'media_rujukan',
    'sumber_info', 'hobi', 'riwayat_sakit', 'mulai_kerja', 'siap_bekerja'
  ]
  for (const field of requiredFields) {
    if (!form[field]) {
      const label = fieldLabels[field] || field
      showToast(`${label} wajib diisi`, 'error')
      return
    }
  }
  if (form.rutin_kajian === 'iya' && !form.ustadz_kajian) {
    showToast('Sebutkan ustadz yang biasa Anda ikuti kajiannya', 'error')
    return
  }
  if (!files.cv || !files.ijazah || !files.transkrip) {
    showToast('CV, Ijazah, dan Transkrip Nilai wajib diupload', 'error')
    return
  }
  if (!form.lowongan_id) {
    showToast('Pilih posisi yang dilamar', 'error')
    return
  }

  const token = localStorage.getItem('token') || localStorage.getItem('candidate_token') || ''
  if (!token) {
    showToast('Anda belum login', 'error')
    return
  }

  const payload: ApplyPayload = {
    lowongan_id: Number(form.lowongan_id),
    expected_location: form.expected_location,
    priority_first: form.priority_first ? Number(form.priority_first) : undefined,
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
  }

  try {
    await submit(token, payload, {
      cv: files.cv,
      ijazah: files.ijazah,
      transkrip: files.transkrip,
      pendukung: files.pendukung,
    })
    showToast('Lamaran berhasil dikirim!', 'success')
    setTimeout(() => close(), 2000)
  } catch (e: any) {
    showToast(e.message || 'Terjadi kesalahan', 'error')
  }
}

const close = () => emit('close')
const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }

onMounted(async () => {

  window.addEventListener(
    'keydown',
    handleEsc
  )


  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('candidate_token') ||
    ''


  if (token) {

    await Promise.all([
      loadProfile(token),
      loadJobs()
    ])


    // ===============================
    // AUTO SELECT LOWONGAN DARI PROP
    // ===============================

    if (props.jobId) {

      const jobData =
        jobs.value.find(
          (j: any) =>
            j.id === props.jobId
        )


      if (jobData) {

        selectedCategoryName.value =
          jobData.category_name ||
          jobData.kategori?.name ||
          ''


        form.lowongan_id =
          props.jobId

      }

    }


  } else {

    showToast(
      'Silakan login terlebih dahulu',
      'error'
    )

  }

})


onBeforeUnmount(() => {

  window.removeEventListener(
    'keydown',
    handleEsc
  )

})
</script>

<style scoped>
/* Modern, clean SaaS style */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
}
.modal-container {
  position: relative;
  width: 100%;
  max-width: 960px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.apply-form-content {
  padding: 32px 28px 0;
}

/* Header */
.form-header {
  text-align: center;
  margin-bottom: 40px;
}
.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #eff6ff;
  color: #2563eb;
  margin-bottom: 16px;
}
.header-badge {
  display: inline-flex;
  padding: 6px 16px;
  border-radius: 100px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}
.form-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}
.form-header p {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 24px;
}
.progress-area {
  max-width: 300px;
  margin: 0 auto;
}
.progress-bar-track {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
}
.progress-bar-fill {
  height: 100%;
  background: #2563eb;
  border-radius: 10px;
  transition: width 0.4s ease;
}
.progress-text {
  font-size: 0.75rem;
  color: #475569;
  font-weight: 500;
}

/* Cards */
.apply-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.form-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  transition: box-shadow 0.2s;
}
.form-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}
.card-heading {
  margin-bottom: 24px;
}
.card-heading h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}
.card-heading p {
  color: #64748b;
  font-size: 0.8rem;
}

/* Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
.full-width {
  grid-column: 1 / -1;
}

/* Form group */
.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}
.required {
  color: #ef4444;
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #dbe2ea;
  border-radius: 12px;
  background: #ffffff;
  font-size: 0.9rem;
  color: #1e293b;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  height: 44px;
}
.form-group textarea {
  height: auto;
}
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}
.form-group input[readonly],
.form-group textarea[readonly] {
  background: #f8fafc;
  color: #64748b;
  cursor: not-allowed;
}

.radio-group {
  display: flex;
  gap: 24px;
  padding: 8px 0;
}
.radio-group.vertical {
  flex-direction: column;
  gap: 12px;
}
.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #334155;
}
.mt-2 {
  margin-top: 8px;
}

/* Upload */
.upload-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  background: #f8fafc;
  color: #64748b;
  transition: all 0.2s;
  cursor: pointer;
  gap: 8px;
  position: relative;
  text-align: center;
}
.upload-box:hover {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}
.upload-box.has-file {
  border-color: #10b981;
  background: #f0fdf4;
  color: #065f46;
}
.upload-box input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.upload-icon {
  font-size: 1.5rem;
}

/* Summary */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.summary-item {
  background: #f9fafb;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.summary-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.summary-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #0f172a;
  word-break: break-word;
}

/* Sticky Footer */
.sticky-footer {
  position: sticky;
  bottom: 0;
  background: #ffffff;
  padding: 16px 0;
  margin-top: 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  z-index: 10;
}
.btn-cancel {
  padding: 12px 24px;
  border: 1px solid #dbe2ea;
  border-radius: 12px;
  background: #ffffff;
  color: #334155;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover {
  background: #f1f5f9;
}
.btn-submit {
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}
.btn-submit:hover:not(:disabled) {
  background: #1d4ed8;
}
.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 24px;
  border-radius: 100px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  z-index: 100000;
  font-size: 0.9rem;
  font-weight: 500;
}
.toast.success {
  background: #10b981;
  color: white;
}
.toast.error {
  background: #ef4444;
  color: white;
}

/* Responsive */
@media (max-width: 640px) {
  .apply-form-content {
    padding: 24px 16px 0;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .sticky-footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }
  .btn-cancel, .btn-submit {
    width: 100%;
    justify-content: center;
  }
}
</style>
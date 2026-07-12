<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-container form-modal">
      <div class="modal-header">
        <h2>Form Lamaran: {{ lowongan.title }}</h2>
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>

      <div class="stepper-form">
        <div class="step-indicator">
          <div v-for="(stepName, idx) in stepNames" :key="idx" 
               :class="['step', { active: currentStep >= idx+1, completed: currentStep > idx+1 }]">
            <span class="step-number">{{ idx+1 }}</span>
            <span class="step-label">{{ stepName }}</span>
          </div>
        </div>

        <div class="step-content">
          <!-- STEP 1: Data Pribadi -->
          <div v-if="currentStep === 1" class="step-pane">
            <h3>Data Pribadi</h3>
            <div class="form-grid">
              <div class="form-field"><label>Nama Lengkap *</label><input v-model="lamaran.nama" placeholder="Nama lengkap" /></div>
              <div class="form-field"><label>Email *</label><input type="email" v-model="lamaran.email" placeholder="email@perusahaan.com" /></div>
              <div class="form-field"><label>Nomor HP *</label><input v-model="lamaran.noHp" placeholder="08123456789" /></div>
              <div class="form-field"><label>Tanggal Lahir</label><input type="date" v-model="lamaran.tglLahir" /></div>
              <div class="form-field"><label>Jenis Kelamin</label><select v-model="lamaran.jenisKelamin"><option>Laki-laki</option><option>Perempuan</option></select></div>
              <div class="form-field full-width"><label>Alamat</label><input v-model="lamaran.alamat" placeholder="Alamat lengkap" /></div>
            </div>
          </div>

          <!-- STEP 2: Pendidikan & Pengalaman -->
          <div v-if="currentStep === 2" class="step-pane">
            <h3>Pendidikan Terakhir</h3>
            <div class="form-grid">
              <div class="form-field"><label>Jenjang</label><input v-model="lamaran.pendidikanTerakhir" placeholder="S1, D3, SMA" /></div>
              <div class="form-field"><label>Institusi</label><input v-model="lamaran.institusi" placeholder="Nama Universitas/Sekolah" /></div>
              <div class="form-field"><label>Tahun Lulus</label><input v-model="lamaran.tahunLulus" placeholder="2020" /></div>
            </div>

            <h3>Pengalaman Kerja <button type="button" class="btn-icon-add" @click="tambahPengalaman">+ Tambah</button></h3>
            <div v-for="(exp, idx) in lamaran.pengalamanKerja" :key="idx" class="exp-card">
              <div class="exp-header">
                <strong>Pengalaman {{ idx+1 }}</strong>
                <button class="btn-icon-remove" @click="hapusPengalaman(idx)">Hapus</button>
              </div>
              <div class="form-grid">
                <div class="form-field"><label>Perusahaan</label><input v-model="exp.perusahaan" /></div>
                <div class="form-field"><label>Posisi</label><input v-model="exp.posisi" /></div>
                <div class="form-field"><label>Periode</label><input v-model="exp.tahun" placeholder="2020-2022" /></div>
                <div class="form-field full-width"><label>Deskripsi</label><textarea v-model="exp.deskripsi" rows="2"></textarea></div>
              </div>
            </div>
            <div v-if="lamaran.pengalamanKerja.length === 0" class="info-note">Belum ada pengalaman kerja (kosongkan jika fresh graduate)</div>
          </div>

          <!-- STEP 3: CV & Portofolio -->
          <div v-if="currentStep === 3" class="step-pane">
            <h3>Upload CV</h3>
            <UploadCV @file-selected="handleCVSelected" />
            
            <h3>Portofolio (Opsional)</h3>
            <input v-model="lamaran.portofolioUrl" placeholder="https://github.com/username atau link portofolio" class="full-width" />
          </div>

          <!-- STEP 4: Motivasi & Harapan Gaji -->
          <div v-if="currentStep === 4" class="step-pane">
            <h3>Motivasi Melamar</h3>
            <textarea v-model="lamaran.motivasi" rows="5" placeholder="Ceritakan mengapa Anda tertarik dengan posisi ini dan mengapa kami harus memilih Anda..."></textarea>
            <div class="form-field">
              <label>Harapan Gaji (Rp)</label>
              <input type="number" v-model="lamaran.harapanGaji" placeholder="Contoh: 8000000" />
            </div>
          </div>
        </div>

        <div class="modal-footer step-buttons">
          <button v-if="currentStep > 1" class="btn-secondary" @click="currentStep--">Kembali</button>
          <button v-if="currentStep < 4" class="btn-primary" @click="currentStep++">Lanjut</button>
          <button v-if="currentStep === 4" class="btn-success" @click="submitLamaranFinal">Kirim Lamaran</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import UploadCV from './UploadCV.vue'

interface PengalamanKerja {
  perusahaan: string
  posisi: string
  tahun: string
  deskripsi: string
}

interface Lowongan {
  id: number
  title: string
}

interface Lamaran {
  lowonganId: number
  lowonganTitle: string

  nama: string
  email: string
  noHp: string
  tglLahir: string
  jenisKelamin: string
  alamat: string

  pendidikanTerakhir: string
  institusi: string
  tahunLulus: string

  pengalamanKerja: PengalamanKerja[]

  cvFile: File | null

  portofolioUrl: string

  motivasi: string

  harapanGaji: number
}

const props = defineProps<{
  show: boolean
  lowongan: Lowongan
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const currentStep = ref(1)

const stepNames = [
  "Data Pribadi",
  "Pendidikan & Pengalaman",
  "CV & Portofolio",
  "Motivasi"
]

const lamaran = reactive<Lamaran>({
  lowonganId: props.lowongan.id,
  lowonganTitle: props.lowongan.title,

  nama: "",
  email: "",
  noHp: "",

  tglLahir: "",
  jenisKelamin: "Laki-laki",
  alamat: "",

  pendidikanTerakhir: "",
  institusi: "",
  tahunLulus: "",

  pengalamanKerja: [],

  cvFile: null,

  portofolioUrl: "",

  motivasi: "",

  harapanGaji: 0
})

const tambahPengalaman = (): void => {

  lamaran.pengalamanKerja.push({
    perusahaan: "",
    posisi: "",
    tahun: "",
    deskripsi: ""
  })
}

const hapusPengalaman = (
  idx: number
): void => {

  lamaran.pengalamanKerja.splice(idx, 1)
}

const handleCVSelected = (
  file: File
): void => {

  lamaran.cvFile = file
}

const handleClose = (): void => {

  emit('close')

  document.body.style.overflow =
    'auto'
}

const submitLamaranFinal = (): void => {

  if (
    !lamaran.nama ||
    !lamaran.email ||
    !lamaran.noHp
  ) {

    alert(
      "Harap lengkapi data pribadi terlebih dahulu."
    )

    currentStep.value = 1

    return
  }

  if (!lamaran.cvFile) {

    alert(
      "Harap upload CV Anda."
    )

    currentStep.value = 3

    return
  }

  console.log(
    "Lamaran berhasil dikirim"
  )

  console.log(lamaran)

  alert(
    "Lamaran berhasil dikirim"
  )

  handleClose()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 28px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.2);
}

.form-modal {
  width: 720px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-bottom: 1px solid #edf2f7;
}

.modal-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #94a3b8;
  line-height: 1;
}

.close-btn:hover {
  color: #475569;
}

.stepper-form {
  width: 100%;
}

.step-indicator {
  display: flex;
  justify-content: space-between;
  padding: 20px 28px;
  background: #f9fbfd;
  border-bottom: 1px solid #edf2f7;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 18px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: #e2e8f0;
  z-index: 0;
}

.step.active .step-number {
  background: #1f6392;
  color: white;
  border-color: #1f6392;
}

.step.completed .step-number {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 8px;
  z-index: 1;
  background: white;
}

.step-label {
  font-size: 12px;
  font-weight: 500;
  color: #5b6e8c;
}

.step.active .step-label {
  color: #1f6392;
  font-weight: 600;
}

.step-content {
  padding: 24px 28px;
}

.step-pane h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #0f172a;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: span 2;
}

.form-field label {
  font-size: 13px;
  font-weight: 600;
  color: #2c3e5c;
  margin-bottom: 6px;
}

.form-field input, .form-field select, .form-field textarea {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: 0.2s;
}

.form-field input:focus, .form-field select:focus, .form-field textarea:focus {
  outline: none;
  border-color: #1f6392;
  box-shadow: 0 0 0 3px rgba(31, 99, 146, 0.1);
}

.exp-card {
  background: #fafcff;
  border: 1px solid #edf2f7;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 16px;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.btn-icon-add {
  background: none;
  border: 1px solid #cbd5e1;
  border-radius: 30px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  color: #1f6392;
}

.btn-icon-remove {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 12px;
}

.info-note {
  font-size: 13px;
  color: #6c7a91;
  font-style: italic;
}

.full-width {
  width: 100%;
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-size: 14px;
}

.modal-footer {
  padding: 20px 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #edf2f7;
}

.step-buttons {
  justify-content: space-between;
}

.btn-primary, .btn-secondary, .btn-success {
  padding: 10px 24px;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #1f6392;
  color: white;
}

.btn-primary:hover {
  background: #154e73;
}

.btn-secondary {
  background: #f1f5f9;
  color: #1e293b;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #0e9f6e;
}

@media (max-width: 768px) {
  .form-modal {
    width: 95%;
  }
  
  .modal-header h2 {
    font-size: 18px;
  }
  
  .step-indicator {
    padding: 12px 16px;
  }
  
  .step-label {
    display: none;
  }
  
  .step:not(:last-child)::after {
    top: 18px;
  }
  
  .step-content {
    padding: 16px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-field.full-width {
    grid-column: span 1;
  }
}
</style>
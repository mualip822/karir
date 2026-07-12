<template>
  <div class="career-form-wrapper">
    <!-- HEADER -->
    <div class="form-header">
      <h1>Formulir Lamaran Kerja</h1>

      <p>
        Silakan isi formulir dengan lengkap dan benar.
      </p>
    </div>

    <!-- PROGRESS -->
    <div class="progress-wrapper">
      <div
        v-for="(label, index) in stepLabels"
        :key="index"
        class="progress-item"
        :class="{ active: currentStep >= index + 1 }"
      >
        <div class="circle">
          {{ index + 1 }}
        </div>

        <span>{{ label }}</span>
      </div>
    </div>

    <!-- FORM -->
    <form @submit.prevent="handleSubmit">
      <!-- STEP 1 -->
      <section v-if="currentStep === 1">
        <div class="section-title">
          Data Pribadi
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Nama Lengkap *</label>

            <input
              v-model="form.fullName"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label>NIK *</label>

            <input
              v-model="form.nik"
              type="text"
              required
            />
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Email *</label>

            <input
              v-model="form.email"
              type="email"
              required
            />
          </div>

          <div class="form-group">
            <label>Nomor HP / WhatsApp *</label>

            <input
              v-model="form.phone"
              type="text"
              required
            />
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Jenis Kelamin *</label>

            <select v-model="form.gender">
              <option value="">
                Pilih Jenis Kelamin
              </option>

              <option value="Laki-laki">
                Laki-laki
              </option>

              <option value="Perempuan">
                Perempuan
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Status Pernikahan *</label>

            <select v-model="form.maritalStatus">
              <option value="">
                Pilih Status
              </option>

              <option value="Belum Menikah">
                Belum Menikah
              </option>

              <option value="Menikah">
                Menikah
              </option>

              <option value="Cerai">
                Cerai
              </option>
            </select>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Tempat Lahir</label>

            <input v-model="form.birthPlace" />
          </div>

          <div class="form-group">
            <label>Tanggal Lahir *</label>

            <input
              type="date"
              v-model="form.birthDate"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Alamat Lengkap *</label>

          <textarea
            rows="4"
            v-model="form.address"
          />
        </div>

        <div class="grid-3">
          <div class="form-group">
            <label>Provinsi</label>

            <input v-model="form.province" />
          </div>

          <div class="form-group">
            <label>Kota / Kabupaten</label>

            <input v-model="form.city" />
          </div>

          <div class="form-group">
            <label>Kode Pos</label>

            <input v-model="form.postalCode" />
          </div>
        </div>
      </section>

      <!-- STEP 2 -->
      <section v-if="currentStep === 2">
        <div class="section-title">
          Data Lamaran Kerja
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Posisi yang Dilamar *</label>

            <input
              v-model="form.position"
              type="text"
            />
          </div>

          <div class="form-group">
            <label>Lembaga / Divisi Tujuan *</label>

            <input
              v-model="form.division"
              type="text"
            />
          </div>
        </div>

        <div class="form-group">
          <label>
            Lokasi Kerja yang Diinginkan /
            Penempatan
          </label>

          <input
            v-model="form.placement"
            type="text"
          />
        </div>

        <div class="checkbox-group">
          <input
            type="checkbox"
            v-model="form.readyPlacement"
          />

          <span>
            Bersedia ditempatkan dimana saja
          </span>
        </div>
      </section>

      <!-- STEP 3 -->
      <section v-if="currentStep === 3">
        <div class="section-title">
          Pendidikan
        </div>

        <div
          class="card-box"
          v-for="(edu, index) in form.educations"
          :key="index"
        >
          <div class="grid-2">
            <div class="form-group">
              <label>Pendidikan Terakhir</label>

              <input v-model="edu.level" />
            </div>

            <div class="form-group">
              <label>
                Nama Sekolah / Kampus
              </label>

              <input
                v-model="edu.institution"
              />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label>Jurusan</label>

              <input v-model="edu.major" />
            </div>

            <div class="form-group">
              <label>Tahun Lulus</label>

              <input
                v-model="edu.graduationYear"
              />
            </div>
          </div>

          <div class="form-group">
            <label>
              Riwayat Pengabdian Pesantren
              (Jika Ada)
            </label>

            <textarea
              rows="3"
              v-model="edu.pesantrenExperience"
            />
          </div>

          <button
            type="button"
            class="btn-danger"
            @click="removeEducation(index)"
          >
            Hapus
          </button>
        </div>

        <button
          type="button"
          class="btn-outline"
          @click="addEducation"
        >
          + Tambah Pendidikan
        </button>
      </section>

      <!-- STEP 4 -->
      <section v-if="currentStep === 4">
        <div class="section-title">
          Keislaman
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>
              Nilai / Skor Motivasi Keislaman
            </label>

            <input
              type="number"
              min="1"
              max="100"
              v-model="form.islamicScore"
            />
          </div>

          <div class="form-group">
            <label>
              Apakah Rutin Mengikuti Kajian
            </label>

            <select v-model="form.joinKajian">
              <option value="">
                Pilih
              </option>

              <option value="Ya">
                Ya
              </option>

              <option value="Tidak">
                Tidak
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Ustadz yang Diikuti</label>

          <textarea
            rows="3"
            v-model="form.followedUstadz"
          />
        </div>

        <div class="form-group">
          <label>
            Ulama Internasional yang
            Diikuti
          </label>

          <textarea
            rows="3"
            v-model="form.followedScholar"
          />
        </div>

        <div class="form-group">
          <label>
            Situs Islam yang Sering Dibaca
          </label>

          <textarea
            rows="3"
            v-model="form.islamicWebsite"
          />
        </div>

        <div class="form-group">
          <label>
            Media Islam yang Sering
            Ditonton / Diikuti
          </label>

          <textarea
            rows="3"
            v-model="form.islamicMedia"
          />
        </div>
      </section>

      <!-- STEP 5 -->
      <section v-if="currentStep === 5">
        <div class="section-title">
          Informasi Tambahan
        </div>

        <div class="form-group">
          <label>Motivasi Melamar</label>

          <textarea
            rows="5"
            v-model="form.motivation"
          />
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>
              Sumber Mengetahui Lowongan
            </label>

            <input
              v-model="form.jobSource"
            />
          </div>

          <div class="form-group">
            <label>
              Gaji yang Diharapkan
            </label>

            <input
              v-model="form.salaryExpectation"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Hobi</label>

          <textarea
            rows="3"
            placeholder="Bisa lebih dari satu"
            v-model="form.hobbies"
          />
        </div>

        <div class="form-group">
          <label>Deskripsi Diri</label>

          <textarea
            rows="5"
            v-model="form.selfDescription"
          />
        </div>

        <div class="form-group">
          <label>Kesiapan Bekerja</label>

          <textarea
            rows="3"
            placeholder="Siap segera, siap ditempatkan, dll"
            v-model="form.workReadiness"
          />
        </div>
      </section>

      <!-- STEP 6 -->
      <section v-if="currentStep === 6">
        <div class="section-title">
          Sosial Media
        </div>

        <div
          class="card-box"
          v-for="(social, index) in form.socialMedia"
          :key="index"
        >
          <div class="grid-2">
            <div class="form-group">
              <label>Platform</label>

              <select v-model="social.platform">
                <option value="">
                  Pilih Platform
                </option>

                <option>
                  Instagram
                </option>

                <option>
                  Facebook
                </option>

                <option>
                  LinkedIn
                </option>

                <option>
                  TikTok
                </option>

                <option>
                  YouTube
                </option>

                <option>
                  Lainnya
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Username / URL</label>

              <input
                v-model="social.username"
              />
            </div>
          </div>

          <button
            type="button"
            class="btn-danger"
            @click="removeSocial(index)"
          >
            Hapus
          </button>
        </div>

        <button
          type="button"
          class="btn-outline"
          @click="addSocial"
        >
          + Tambah Sosial Media
        </button>
      </section>

      <!-- STEP 7 -->
      <section v-if="currentStep === 7">
        <div class="section-title">
          Upload Berkas
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Upload CV *</label>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
            />
          </div>

          <div class="form-group">
            <label>Upload KTP *</label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Upload Ijazah</label>

            <input type="file" />
          </div>

          <div class="form-group">
            <label>
              Upload Transkrip Nilai
            </label>

            <input type="file" />
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Upload Sertifikat</label>

            <input
              type="file"
              multiple
            />
          </div>

          <div class="form-group">
            <label>
              Dokumen Pendukung Lainnya
            </label>

            <input
              type="file"
              multiple
            />
          </div>
        </div>

        <div class="checkbox-group">
          <input
            type="checkbox"
            v-model="form.agreement"
          />

          <span>
            Saya menyetujui data diproses
            untuk kebutuhan rekrutmen
          </span>
        </div>
      </section>

      <!-- ACTION -->
      <div class="action-wrapper">
        <button
          type="button"
          v-if="currentStep > 1"
          class="btn-secondary"
          @click="prevStep"
        >
          Kembali
        </button>

        <button
          type="button"
          v-if="currentStep < 7"
          class="btn-primary"
          @click="nextStep"
        >
          Lanjut
        </button>

        <button
          v-if="currentStep === 7"
          type="submit"
          class="btn-primary"
        >
          Kirim Lamaran
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const currentStep = ref(1);

const stepLabels = [
  "Pribadi",
  "Lamaran",
  "Pendidikan",
  "Keislaman",
  "Tambahan",
  "Sosial Media",
  "Berkas"
];

const form = reactive({
  fullName: "",
  nik: "",
  email: "",
  phone: "",
  gender: "",
  maritalStatus: "",
  birthPlace: "",
  birthDate: "",
  address: "",
  province: "",
  city: "",
  postalCode: "",

  position: "",
  division: "",
  placement: "",
  readyPlacement: false,

  educations: [
    {
      level: "",
      institution: "",
      major: "",
      graduationYear: "",
      pesantrenExperience: ""
    }
  ],

  islamicScore: "",
  joinKajian: "",
  followedUstadz: "",
  followedScholar: "",
  islamicWebsite: "",
  islamicMedia: "",

  motivation: "",
  jobSource: "",
  salaryExpectation: "",
  hobbies: "",
  selfDescription: "",
  workReadiness: "",

  socialMedia: [
    {
      platform: "",
      username: ""
    }
  ],

  agreement: false
});

function nextStep() {
  if (currentStep.value < 7) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function addEducation() {
  form.educations.push({
    level: "",
    institution: "",
    major: "",
    graduationYear: "",
    pesantrenExperience: ""
  });
}

function removeEducation(index: number) {
  form.educations.splice(index, 1);
}

function addSocial() {
  form.socialMedia.push({
    platform: "",
    username: ""
  });
}

function removeSocial(index: number) {
  form.socialMedia.splice(index, 1);
}

function handleSubmit() {
  console.log(form);

  alert("Lamaran berhasil dikirim");
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  background: #f8fafc;
}

.career-form-wrapper {
  max-width: 1100px;
  margin: auto;
  padding: 40px 20px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h1 {
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 10px;
  color: #0f172a;
}

.form-header p {
  color: #64748b;
}

.progress-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.progress-item {
  flex: 1;
  min-width: 100px;
  text-align: center;
}

.circle {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #64748b;
  margin: auto;
  line-height: 46px;
  font-weight: bold;
  transition: 0.3s;
}

.progress-item.active .circle {
  background: #0f766e;
  color: white;
}

.progress-item span {
  display: block;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #0f172a;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.form-group {
  margin-bottom: 22px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1e293b;
}

input,
textarea,
select {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #dbe2ea;
  font-size: 14px;
  transition: 0.3s;
  outline: none;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

textarea {
  resize: vertical;
}

.card-box {
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  margin-bottom: 20px;
  background: white;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.checkbox-group input {
  width: auto;
}

.action-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}

.btn-primary {
  background: #0f766e;
  color: white;
  border: none;
  padding: 14px 30px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.3s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 14px 30px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
}

.btn-outline {
  background: transparent;
  border: 1px dashed #94a3b8;
  padding: 12px 20px;
  border-radius: 14px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }

  .action-wrapper {
    flex-direction: column;
    gap: 14px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
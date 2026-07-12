<template>
  <div class="settings-page">

    <!-- HEADER -->
    <div class="header">
      <div>
        <h2>Pengaturan Akun</h2>
        <p>Kelola keamanan dan pengaturan akun kamu</p>
      </div>
    </div>

    <div class="settings-wrapper">

      <!-- PASSWORD -->
      <div class="card">

        <h3>Ganti Password</h3>

        <div class="form-group">
          <label>Password Lama</label>
          <div class="input-group">
            <input :type="showOld ? 'text' : 'password'" v-model="form.old_password" />
            <span @click="showOld = !showOld">👁️</span>
          </div>
        </div>

        <div class="form-group">
          <label>Password Baru</label>
          <div class="input-group">
            <input :type="showNew ? 'text' : 'password'" v-model="form.new_password" />
            <span @click="showNew = !showNew">👁️</span>
          </div>
        </div>

        <div class="form-group">
          <label>Konfirmasi Password</label>
          <div class="input-group">
            <input :type="showConfirm ? 'text' : 'password'" v-model="form.confirm_password" />
            <span @click="showConfirm = !showConfirm">👁️</span>
          </div>
        </div>

        <button class="btn-primary" @click="updatePassword">
          Update Password
        </button>

      </div>

    

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue"

const form = ref({
  old_password: "",
  new_password: "",
  confirm_password: "",
  notif: true,
  darkmode: false
})

const showOld = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

// update password
const updatePassword = () => {
  if (form.value.new_password !== form.value.confirm_password) {
    alert("Password tidak cocok!")
    return
  }

  console.log("UPDATE PASSWORD:", form.value)
  alert("Password berhasil diupdate!")
}

// simpan setting
const saveSetting = () => {
  console.log("SETTING:", form.value)
  alert("Pengaturan disimpan!")
}

// hapus akun
const deleteAccount = () => {
  if (confirm("Yakin mau hapus akun?")) {
    alert("Akun dihapus (dummy)")
  }
}
</script>

<style scoped>

/* PAGE */
.settings-page {
  padding: 20px;
}

/* HEADER */
.header {
  margin-bottom: 20px;
}

.header h2 {
  font-size: 24px;
  font-weight: bold;
}

.header p {
  color: #777;
}

/* WRAPPER */
.settings-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* CARD */
.card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.card h3 {
  margin-bottom: 15px;
}

/* FORM */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

/* INPUT GROUP */
.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

.input-group input {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
}

.input-group span {
  padding: 0 10px;
  cursor: pointer;
}

/* SWITCH */
.switch-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

/* BUTTON */
.btn-primary {
  background: #2563eb;
  color: white;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.btn-save {
  background: linear-gradient(135deg,#2563eb,#16a34a);
  color: white;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

/* DANGER */
.card.danger {
  border: 1px solid #f87171;
}

.btn-danger {
  background: #ef4444;
  color: white;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .settings-wrapper {
    gap: 15px;
  }
}

</style>
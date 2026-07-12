
<template>
  <div class="login-card">
    <!-- Card Header -->
    <div class="card-header">
      <div class="card-logo">
        <div class="logo-circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <h2 class="card-title">Masuk ke Sistem</h2>
      <p class="card-subtitle">Silakan login untuk melanjutkan</p>
    </div>

    <!-- Login Form -->
    <form @submit.prevent="handleSubmit" class="login-form">
      <!-- Email Field -->
      <div class="form-group">
        <label for="email" class="form-label">Alamat Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-input"
          placeholder="nama@yayasan.sch.id"
          autocomplete="email"
          required
        />
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password" class="form-label">Kata Sandi</label>
        <div class="password-wrapper">
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            class="form-input password-input"
            placeholder="Masukkan kata sandi"
            autocomplete="current-password"
            required
          />
          <button
            type="button"
            class="toggle-btn"
            @click="togglePassword"
            :title="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
          >
            <svg
              v-if="!showPassword"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form Options -->
      <div class="form-options">
        <label class="checkbox-label">
          <input type="checkbox" v-model="remember" class="checkbox-input" />
          <span class="checkbox-text">Ingat saya</span>
        </label>
        <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">
          Lupa kata sandi?
        </a>
      </div>

      <!-- Error Message -->
      <transition name="slide-down">
        <div v-if="auth.error" class="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{{ auth.error }}</span>
        </div>
      </transition>

      <!-- Submit Button -->
      <button type="submit" class="submit-btn" :disabled="auth.loading">
        <span v-if="auth.loading" class="btn-spinner"></span>
        <span v-else class="btn-text">Masuk</span>
        <span v-if="auth.loading" class="btn-text">Memproses...</span>
      </button>
    </form>

    <!-- Help Text -->
    <div class="help-text">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <span>Silakan hubungi administrator untuk akses akun</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/useAuthStore';

const auth = useAuthStore();

const email = ref('');
const password = ref('');
const remember = ref(false);
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
  await auth.login({
    email: email.value,
    password: password.value,
    remember: remember.value,
  });
};

const handleForgotPassword = () => {
  console.log('Forgot password clicked');
};
</script>

<style scoped>
.login-card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 48px 40px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.05), 0 4px 12px -4px rgba(0, 0, 0, 0.02);
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  backdrop-filter: blur(0px);
}

.login-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 25px 40px -12px rgba(0, 0, 0, 0.08);
}

/* Card Header */
.card-header {
  text-align: center;
  margin-bottom: 36px;
}

.card-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.logo-circle {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px -6px rgba(37, 99, 235, 0.25);
  transition: transform 0.3s ease;
}

.login-card:hover .logo-circle {
  transform: scale(1.02);
}

.card-title {
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.card-subtitle {
  font-size: 14px;
  color: #64748B;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  letter-spacing: -0.2px;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #1E293B;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 12px;
  transition: all 0.2s ease;
  outline: none;
}

.form-input::placeholder {
  color: #94A3B8;
  font-size: 13px;
}

.form-input:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}

.form-input:hover:not(:focus) {
  border-color: #CBD5E1;
}

/* Password Wrapper */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  padding-right: 44px;
}

.toggle-btn {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.toggle-btn:hover {
  color: #2563EB;
  background: #F1F5F9;
}

.toggle-btn:active {
  transform: scale(0.95);
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #2563EB;
  transition: all 0.2s ease;
}

.checkbox-text {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.forgot-link {
  font-size: 13px;
  color: #2563EB;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.forgot-link:hover {
  color: #1D4ED8;
  text-decoration: underline;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #FEF2F2;
  border-left: 3px solid #DC2626;
  border-radius: 12px;
  color: #DC2626;
  font-size: 12px;
  font-weight: 500;
}

.error-message svg {
  flex-shrink: 0;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 12px 20px;
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.submit-btn:hover:not(:disabled) {
  background: #1D4ED8;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px -8px rgba(37, 99, 235, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Button Spinner */
.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.btn-text {
  font-size: 14px;
  font-weight: 700;
}

/* Help Text */
.help-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #E2E8F0;
  font-size: 12px;
  color: #64748B;
}

.help-text svg {
  flex-shrink: 0;
  opacity: 0.6;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .login-card {
    padding: 40px 32px;
  }

  .card-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }

  .card-title {
    font-size: 22px;
  }

  .card-subtitle {
    font-size: 13px;
  }

  .form-input {
    padding: 10px 12px;
  }

  .submit-btn {
    padding: 11px 20px;
  }

  .help-text {
    font-size: 11px;
  }
}
</style>
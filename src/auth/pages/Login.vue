<template>
  <div class="login-split">

    <!-- LEFT PANEL -->
    <div class="message-panel">

      <div class="message-content">

        <!-- LOGO -->
        <div class="logo-container">

          <div class="logo-icon">

            <img
              src="../../website/components/logo.jpg"
              alt="Imam Nawawi"
              class="logo-image"
            />

          </div>

          <div class="logo-text">

            <span class="logo-title">
              Yayasan Dakwah Imam Nawawi
            </span>

            <span class="logo-sub">
              Career Center
            </span>

          </div>

        </div>

        <!-- HERO -->
        <div class="hero-message">

          <div class="hero-badge">
            CAREER & DAKWAH
          </div>

          <h1 class="main-title">
            Bergabung Bersama
            Tim Pendidikan Islam
            Profesional
          </h1>

          <p class="main-subtitle">
            Jadilah bagian dari Yayasan Dakwah Imam Nawawi
            dalam membangun pendidikan Islam yang modern,
            profesional, dan berdampak untuk umat.
          </p>

          <p class="supporting-text">
            Kami membuka peluang karir bagi guru,
            staf pendidikan, administrasi, IT,
            dan berbagai posisi lainnya untuk berkembang bersama.
          </p>

        </div>

        <!-- FEATURES -->
        <div class="features-section">

          <div
            class="feature-item"
            v-for="(feature, index) in features"
            :key="index"
          >

            <div class="feature-dot"></div>

            <span>
              {{ feature }}
            </span>

          </div>

        </div>

        <!-- QUOTE -->
        <div class="quote-container">

          <div class="quote-icon">
            ✦
          </div>

          <p class="quote-text">
            "Pendidikan adalah jalan membangun
            generasi rabbani yang berilmu dan berakhlak."
          </p>

          <p class="quote-source">
            — Yayasan Dakwah Imam Nawawi
          </p>

        </div>

      </div>

    </div>

    <!-- RIGHT PANEL -->
    <div class="form-panel">

      <div class="login-card">

        <!-- HEADER -->
        <div class="login-header">

          <div class="small-badge">
            LOGIN CAREER CENTER
          </div>

          <h2 class="login-title">
            Selamat Datang
          </h2>

          <p class="login-subtitle">
            Masuk menggunakan akun Google
            untuk melanjutkan proses rekrutmen
            dan pengelolaan karir Anda.
          </p>

        </div>

        <!-- GOOGLE BUTTON -->
        <button
          class="google-btn"
          @click="handleGoogleLogin"
        >

          <svg
            class="google-icon"
            width="22"
            height="22"
            viewBox="0 0 48 48"
          >

            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.215 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />

            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 16.108 19.003 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.41 4.337-17.694 10.691z"
            />

            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.196 0-9.625-3.327-11.283-7.946l-6.522 5.025C9.435 39.556 16.227 44 24 44z"
            />

            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.084 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />

          </svg>

          <span>
            Login dengan Google
          </span>

        </button>

        <!-- DIVIDER -->
        <div class="divider">

          <span>
            Aman • Cepat • Terintegrasi
          </span>

        </div>

        <!-- INFO -->
        <div class="info-box">

          <div class="info-item">
            ✓ Akses portal karir lebih mudah
          </div>

          <div class="info-item">
            ✓ Pantau status lamaran kerja realtime
          </div>

          <div class="info-item">
            ✓ Upload CV dan dokumen secara online
          </div>

          <div class="info-item">
            ✓ Terintegrasi dengan sistem rekrutmen yayasan
          </div>

        </div>

        <!-- FOOTER -->
        <div class="card-footer">

          Dengan login, Anda menyetujui
          kebijakan dan sistem rekrutmen
          Yayasan Dakwah Imam Nawawi.

        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { googleTokenLogin } from 'vue3-google-login'
import { useAuthStore } from '../stores/useAuthStore'

const auth = useAuthStore()

// =========================
// FEATURES
// =========================
const features = [
  'Lingkungan kerja Islami dan profesional',
  'Kesempatan dakwah melalui pendidikan',
  'Pengembangan SDM dan pelatihan berkala',
  'Kolaborasi bersama tim pendidikan terbaik',
]

// =========================
// GOOGLE LOGIN (Google Identity Services)
// =========================
const handleCredentialResponse = async (response: any) => {
  try {
    const token = response.credential
    await auth.loginWithGoogle(token)
  } catch (error) {
    console.error('Google Login Error:', error)
  }
}

// =========================
// GOOGLE LOGIN (Popup)
// =========================
const handleGoogleLogin = async () => {
  try {
    const response = await googleTokenLogin()

    if (!response?.access_token) {
      throw new Error('Access token tidak ditemukan.')
    }

    await auth.loginWithGoogle(response.access_token)
  } catch (error) {
    console.error('Google Popup Login Error:', error)
  }
}

onMounted(() => {
  // Inisialisasi jika diperlukan
})
</script>

<style scoped>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

.login-split{
  display:flex;
  min-height:100vh;
  background:#F8FAFC;
  font-family:'Inter',sans-serif;
}

/* =========================
   LEFT PANEL
========================= */
.message-panel{
  flex:1;

  display:flex;
  align-items:center;
  justify-content:center;

  padding:70px;

  background:
    linear-gradient(
      135deg,
      #F8FAFC 0%,
      #FFFFFF 100%
    );

  position:relative;

  overflow:hidden;
}

.message-panel::before{
  content:'';

  position:absolute;

  top:-20%;
  right:-10%;

  width:520px;
  height:520px;

  background:
    radial-gradient(
      circle,
      rgba(15,118,110,.08) 0%,
      transparent 70%
    );
}

.message-content{
  position:relative;
  z-index:2;

  max-width:560px;
}

.logo-container{
  display:flex;
  align-items:center;

  gap:16px;

  margin-bottom:60px;
}

.logo-icon{
  width:68px;
  height:68px;

  border-radius:20px;

  background:white;

  display:flex;
  align-items:center;
  justify-content:center;

  border:1px solid #E2E8F0;

  box-shadow:
    0 12px 24px rgba(15,23,42,.05);
}

.logo-image{
  width:54px;
  height:54px;

  object-fit:contain;
}

.logo-text{
  display:flex;
  flex-direction:column;
}

.logo-title{
  font-size:28px;
  font-weight:800;

  color:#0F172A;

  line-height:1.2;
}

.logo-sub{
  margin-top:4px;

  font-size:14px;
  font-weight:600;

  color:#0F766E;
}

.hero-badge{
  width:max-content;

  padding:
    12px 22px;

  border-radius:999px;

  background:#DCFCE7;

  border:1px solid #BBF7D0;

  color:#0F766E;

  font-size:13px;
  font-weight:800;

  letter-spacing:1px;

  margin-bottom:28px;
}

.main-title{
  font-size:62px;
  line-height:1.05;

  font-weight:900;

  color:#0F172A;

  margin-bottom:28px;

  letter-spacing:-2px;
}

.main-subtitle{
  font-size:19px;
  line-height:1.9;

  color:#475569;

  margin-bottom:18px;
}

.supporting-text{
  font-size:15px;
  line-height:1.9;

  color:#64748B;
}

.features-section{
  margin-top:42px;

  display:flex;
  flex-direction:column;

  gap:18px;
}

.feature-item{
  display:flex;
  align-items:center;

  gap:14px;

  font-size:15px;

  color:#334155;
}

.feature-dot{
  width:8px;
  height:8px;

  border-radius:999px;

  background:#0F766E;
}

.quote-container{
  margin-top:48px;

  padding-top:28px;

  border-top:1px solid #E2E8F0;
}

.quote-icon{
  color:#0F766E;

  font-size:22px;

  margin-bottom:12px;
}

.quote-text{
  font-size:16px;

  line-height:1.8;

  color:#475569;

  font-style:italic;
}

.quote-source{
  margin-top:10px;

  font-size:13px;

  color:#94A3B8;
}

/* =========================
   RIGHT PANEL
========================= */
.form-panel{
  width:42%;

  display:flex;
  align-items:center;
  justify-content:center;

  padding:48px;
}

.login-card{
  width:100%;
  max-width:470px;

  background:white;

  border-radius:32px;

  padding:52px;

  border:1px solid #E2E8F0;

  box-shadow:
    0 20px 50px rgba(15,23,42,.06);
}

.small-badge{
  width:max-content;

  margin:0 auto 18px;

  padding:
    8px 16px;

  border-radius:999px;

  background:#F0FDFA;

  border:1px solid #CCFBF1;

  color:#0F766E;

  font-size:11px;
  font-weight:800;

  letter-spacing:1px;
}

.login-header{
  text-align:center;

  margin-bottom:42px;
}

.login-title{
  font-size:38px;
  font-weight:900;

  color:#0F172A;

  margin-bottom:14px;
}

.login-subtitle{
  font-size:15px;
  line-height:1.8;

  color:#64748B;
}

.google-btn{
  width:100%;

  height:62px;

  border-radius:18px;

  border:1px solid #CBD5E1;

  background:white;

  display:flex;
  align-items:center;
  justify-content:center;

  gap:14px;

  cursor:pointer;

  transition:.3s ease;

  font-size:15px;
  font-weight:800;

  color:#0F172A;
}

.google-btn:hover{
  transform:translateY(-2px);

  border-color:#0F766E;

  box-shadow:
    0 14px 28px rgba(15,118,110,.12);
}

.divider{
  margin:32px 0;

  text-align:center;

  position:relative;
}

.divider::before{
  content:'';

  position:absolute;

  top:50%;
  left:0;

  width:100%;
  height:1px;

  background:#E2E8F0;
}

.divider span{
  position:relative;

  z-index:2;

  background:white;

  padding:0 14px;

  font-size:12px;
  font-weight:700;

  color:#94A3B8;
}

.info-box{
  display:flex;
  flex-direction:column;

  gap:16px;
}

.info-item{
  font-size:14px;
  line-height:1.8;

  color:#475569;
}

.card-footer{
  margin-top:36px;

  padding-top:24px;

  border-top:1px solid #E2E8F0;

  text-align:center;

  font-size:12px;
  line-height:1.8;

  color:#94A3B8;
}

/* =========================
   RESPONSIVE
========================= */
@media(max-width:1200px){

  .main-title{
    font-size:52px;
  }

}

@media(max-width:968px){

  .login-split{
    flex-direction:column;
  }

  .form-panel{
    width:100%;
  }

  .message-panel{
    padding:56px 36px;
  }

  .form-panel{
    padding:36px;
  }

  .main-title{
    font-size:46px;
  }

}

@media(max-width:768px){

  .message-panel{
    padding:42px 24px;
  }

  .login-card{
    padding:38px 28px;
  }

  .main-title{
    font-size:38px;
  }

  .logo-title{
    font-size:22px;
  }

  .main-subtitle{
    font-size:16px;
  }

}

@media(max-width:480px){

  .main-title{
    font-size:34px;
  }

  .login-title{
    font-size:30px;
  }

}
</style>
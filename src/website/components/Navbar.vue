<template>
  <header class="navbar">

    <div class="navbar-container">

      <!-- LOGO -->
      <div class="logo">

        <img
          src="./logo.jpg"
          alt="Imam Nawawi"
          class="logo-img"
        />

        <div class="logo-content">

          <span class="logo-title">
            Yayasan Dakwah Imam Nawawi
          </span>

          <span class="logo-subtitle">
            Career Center
          </span>

        </div>

      </div>

      <!-- MENU -->
      <nav class="nav-menu">

        <a
          href="#about"
          class="nav-link"
        >
          Tentang
        </a>

        <a
          href="#benefits"
          class="nav-link"
        >
          Benefit
        </a>

        <a
          href="#career"
          class="nav-link"
        >
          Lowongan
        </a>

        <a
          href="#footer"
          class="nav-link"
        >
          Kontak
        </a>

      </nav>

      <!-- ACTION -->
      <div class="navbar-actions">

        <!-- LOGIN -->
        <router-link
          to="/login"
          class="login-btn"
        >
          Login
        </router-link>

        <!-- CTA -->
        <button
          class="cta-btn"
          @click="scrollToCareer"
        >
          Gabung Bersama Kami
        </button>

      </div>

    </div>

  </header>
</template>

<script setup lang="ts">

const scrollToCareer = () => {

  const element =
    document.getElementById('career')

  if (element) {

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;

  z-index: 999;

  width: 100%;

  display: flex;
  justify-content: center;

  padding: 18px 20px;

  background: white;
}

.navbar-container {
  width: 100%;
  max-width: 1320px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding:
    12px 28px;

  background:
    rgba(255, 255, 255, 0.92);

  backdrop-filter: blur(14px);

  border:
    1px solid #E2E8F0;

  border-radius: 999px;

  box-shadow:
    0 8px 30px rgba(15, 23, 42, 0.05);
}

/* LOGO */
.logo {
  display: flex;
  align-items: center;

  gap: 14px;
}

.logo-img {
  width: 52px;
  height: 52px;

  border-radius: 16px;

  object-fit: cover;

  border:
    1px solid #E2E8F0;
}

.logo-content {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 18px;
  font-weight: 800;

  color: #0F172A;

  line-height: 1.1;
}

.logo-subtitle {
  font-size: 12px;
  font-weight: 600;

  color: #0F766E;

  margin-top: 3px;
}

/* MENU */
.nav-menu {
  display: flex;
  align-items: center;

  gap: 38px;
}

.nav-link {
  position: relative;

  text-decoration: none;

  font-size: 15px;
  font-weight: 600;

  color: #475569;

  transition: .3s ease;
}

.nav-link:hover {
  color: #0F766E;
}

.nav-link::after {
  content: '';

  position: absolute;

  left: 0;
  bottom: -6px;

  width: 0%;
  height: 2px;

  background: #0F766E;

  transition: .3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* ACTIONS */
.navbar-actions {
  display: flex;
  align-items: center;

  gap: 12px;
}

/* LOGIN */
.login-btn {
  height: 48px;

  padding: 0 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;

  text-decoration: none;

  font-size: 14px;
  font-weight: 700;

  color: #0F766E;

  border: 1px solid #99F6E4;

  background: #F0FDFA;

  transition: .3s ease;
}

.login-btn:hover {
  background: #CCFBF1;
}

/* BUTTON */
.cta-btn {
  height: 52px;

  padding: 0 28px;

  border: none;

  border-radius: 999px;

  background: linear-gradient(
    135deg,
    #0F766E,
    #115E59
  );

  color: white;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: .3s ease;

  box-shadow:
    0 10px 20px rgba(15, 118, 110, 0.18);
}

.cta-btn:hover {
  transform: translateY(-2px);

  background: linear-gradient(
    135deg,
    #0B5E55,
    #134E4A
  );

  box-shadow:
    0 14px 28px rgba(15, 118, 110, 0.22);
}

/* TABLET */
@media (max-width: 992px) {

  .nav-menu {
    gap: 24px;
  }

}

/* MOBILE */
@media (max-width: 768px) {

  .navbar {
    top: 10px;

    padding: 0 12px;
  }

  .navbar-container {
    padding:
      10px 16px;
  }

  .nav-menu {
    display: none;
  }

  .logo-img {
    width: 44px;
    height: 44px;
  }

  .logo-title {
    font-size: 15px;
  }

  .logo-subtitle {
    font-size: 11px;
  }

  .navbar-actions {
    gap: 8px;
  }

  .login-btn {
    height: 40px;

    padding: 0 14px;

    font-size: 12px;
  }

  .cta-btn {
    display: none;
  }

}
</style>
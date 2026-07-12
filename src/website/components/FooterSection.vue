<template>
  <footer
    class="footer"
    id="footer"
  >
    <div class="container">

      <!-- TOP -->
      <div class="footer-top">

        <!-- BRAND -->
        <div class="footer-brand">

          <div class="brand-wrapper">

            <img
              src="@/website/components/logo.jpg"
              alt="Imam Nawawi"
              class="logo"
            />

            <div>
              <span class="brand-label">
                Career Center
              </span>

              <h3>
                Yayasan Dakwah
                Imam Nawawi
              </h3>
            </div>

          </div>

          <p class="brand-description">
            Membangun ekosistem pendidikan Islam modern
            yang profesional, kolaboratif,
            dan berdampak untuk umat.
          </p>

        </div>

        <!-- MENU -->
        <div class="footer-column">

          <h4>
            Navigasi
          </h4>

          <a href="#about">
            Tentang Kami
          </a>

          <a href="#benefits">
            Benefit
          </a>

          <a href="#career">
            Lowongan
          </a>

          <a href="#footer">
            Kontak
          </a>

        </div>

        <!-- KARIR -->
        <div class="footer-column">

          <h4>
            Karier
          </h4>

          <p>
            Full Time
          </p>

          <p>
            Paruh Waktu
          </p>

          <p>
            Pengajar & Staff
          </p>

          <p>
            Rekrutmen Yayasan
          </p>

        </div>

        <!-- CONTACT -->
        <div class="footer-column">

          <h4>
            Kontak
          </h4>

          <p>
            📍 Ciomas, Bogor
          </p>

          <p>
            📧 karir@imamnawawi.sch.id
          </p>

          <p>
            📞 +62 812 0000 0000
          </p>

          <p>
            🌐 imamnawawi.school
          </p>

        </div>

      </div>

      <!-- BOTTOM -->
      <div class="footer-bottom">

        <p>
          © 2025 Yayasan Dakwah Imam Nawawi.
          All rights reserved.
        </p>

        <div class="socials">

          <a href="#">
            Instagram
          </a>

          <a href="#">
            YouTube
          </a>

          <a href="#">
            Facebook
          </a>

        </div>

      </div>

    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;

  background:
    linear-gradient(
      to bottom,
      #0F172A,
      #020617
    );

  padding: 90px 0 32px;

  margin-top: 120px;

  overflow: hidden;
}

.footer::before {
  content: "";

  position: absolute;

  top: -200px;
  right: -200px;

  width: 500px;
  height: 500px;

  background:
    radial-gradient(
      circle,
      rgba(15, 118, 110, 0.12),
      transparent 70%
    );
}

.container {
  width: min(1180px, 92%);
  margin: auto;

  position: relative;
  z-index: 2;
}

/* TOP */
.footer-top {
  display: grid;

  grid-template-columns:
    1.4fr
    .8fr
    .8fr
    1fr;

  gap: 50px;

  padding-bottom: 60px;

  border-bottom:
    1px solid rgba(255,255,255,0.08);
}

/* BRAND */
.footer-brand {
  max-width: 360px;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;

  margin-bottom: 24px;
}

.logo {
  width: 64px;
  height: 64px;

  object-fit: cover;

  border-radius: 20px;

  background: white;

  padding: 6px;
}

.brand-label {
  display: block;

  color: #14B8A6;

  font-size: 13px;
  font-weight: 700;

  letter-spacing: .08em;
  text-transform: uppercase;

  margin-bottom: 6px;
}

.footer-brand h3 {
  color: white;

  font-size: 28px;
  line-height: 1.3;
  font-weight: 700;
}

.brand-description {
  color: #94A3B8;

  font-size: 15px;
  line-height: 1.9;
}

/* COLUMN */
.footer-column h4 {
  color: white;

  font-size: 17px;
  font-weight: 700;

  margin-bottom: 22px;
}

.footer-column a,
.footer-column p {
  display: block;

  color: #94A3B8;

  text-decoration: none;

  font-size: 15px;

  line-height: 1.9;

  margin-bottom: 12px;

  transition: all .25s ease;
}

.footer-column a:hover {
  color: #14B8A6;

  transform: translateX(4px);
}

/* BOTTOM */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-top: 28px;
}

.footer-bottom p {
  color: #64748B;

  font-size: 14px;
}

.socials {
  display: flex;
  align-items: center;
  gap: 24px;
}

.socials a {
  color: #94A3B8;

  text-decoration: none;

  font-size: 14px;
  font-weight: 500;

  transition: .25s ease;
}

.socials a:hover {
  color: #14B8A6;
}

/* TABLET */
@media (max-width: 1024px) {

  .footer-top {
    grid-template-columns:
      1fr
      1fr;

    gap: 40px;
  }

}

/* MOBILE */
@media (max-width: 768px) {

  .footer {
    padding: 70px 0 28px;
    margin-top: 90px;
  }

  .footer-top {
    grid-template-columns: 1fr;

    gap: 40px;

    padding-bottom: 40px;
  }

  .footer-brand {
    max-width: 100%;
  }

  .footer-brand h3 {
    font-size: 24px;
  }

  .footer-bottom {
    flex-direction: column;

    gap: 18px;

    text-align: center;
  }

  .socials {
    gap: 18px;
    flex-wrap: wrap;
    justify-content: center;
  }

}
</style>
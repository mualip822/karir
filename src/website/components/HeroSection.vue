<template>
  <section class="hero">

    <div class="container">

      <div class="hero-grid">

        <!-- LEFT -->
        <div class="hero-content">

          <div class="badge">
            Career & Dakwah
          </div>

          <h1>
            Bangun Karier &
            <span>Dakwah</span>
            Bersama Tim Profesional
          </h1>

          <p class="subhead">
            Bergabung bersama Yayasan Dakwah Imam Nawawi
            dalam membangun ekosistem pendidikan Islam modern
            yang profesional, kolaboratif, dan berdampak
            untuk umat.
          </p>

          <!-- STATS -->
          <!-- STATS -->
<div class="stats">

  <div class="stat-item">
    <h3>50+</h3>
    <p>Tenaga Pendidik</p>
  </div>

  <div class="stat-item">
    <h3>500+</h3>
    <p>Siswa & Santri</p>
  </div>

  <div class="stat-item">
    <h3>10+</h3>
    <p>Tahun Berdiri</p>
  </div>

</div>

          <!-- ACTION -->
          <div class="hero-actions">

            <button
              class="primary-btn"
              @click="scrollToCareer"
            >
              Lihat Lowongan
              <span>→</span>
            </button>

          </div>

        </div>

        <!-- RIGHT -->
        <div class="hero-image-section">

          <div class="hero-image-wrapper">

            <img
              :src="heroImage"
              alt="Pelatihan Guru & Staff"
              class="hero-image"
            />

          </div>

        </div>

      </div>

    </div>

  </section>
</template>

<script setup lang="ts">
import heroImage from '@/assets/images/about-team.jpg'

const scrollToCareer = () => {
  const element = document.getElementById('career')

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<style scoped>
.hero {
  padding: 120px 0 90px;
  background: #ffffff;
  overflow: hidden;
}

.container {
  width: min(1180px, 92%);
  margin: auto;
}

/* GRID */
.hero-grid {
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 70px;
  align-items: center;
}

/* LEFT */
.hero-content {
  max-width: 620px;
}

.badge {
  display: inline-flex;
  align-items: center;

  padding: 10px 18px;

  border-radius: 999px;

  background: #ecfdf5;

  border: 1px solid #d1fae5;

  color: #0f766e;

  font-size: 13px;
  font-weight: 700;

  margin-bottom: 28px;

  text-transform: uppercase;

  letter-spacing: .08em;
}

.hero-content h1 {
  font-size: 72px;
  line-height: 1.05;

  letter-spacing: -0.05em;

  font-weight: 800;

  color: #0f172a;

  margin-bottom: 28px;
}

.hero-content h1 span {
  color: #0f766e;
}

.subhead {
  font-size: 18px;
  line-height: 1.9;

  color: #475569;

  margin-bottom: 42px;

  max-width: 580px;
}

/* STATS */
.stats {
  display: flex;
  gap: 46px;

  margin-bottom: 42px;
}

.stat-item {
  position: relative;
}

.stat-item::after {
  content: "";

  position: absolute;

  top: 8px;
  right: -24px;

  width: 1px;
  height: 52px;

  background: #e2e8f0;
}

.stat-item:last-child::after {
  display: none;
}

.stat-item h3 {
  font-size: 42px;
  line-height: 1;

  font-weight: 800;

  color: #0f172a;

  margin-bottom: 12px;
}

.stat-item p {
  font-size: 15px;
  color: #64748b;
}

/* BUTTON */
.hero-actions {
  display: flex;
  align-items: center;
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  background: #0f766e;
  color: white;

  border: none;

  padding: 18px 32px;

  border-radius: 999px;

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  transition: .3s ease;
}

.primary-btn span {
  transition: .3s ease;
}

.primary-btn:hover {
  background: #0d5f59;

  transform: translateY(-3px);

  box-shadow:
    0 18px 35px rgba(15, 118, 110, 0.18);
}

.primary-btn:hover span {
  transform: translateX(4px);
}

/* RIGHT */
.hero-image-section {
  display: flex;
  justify-content: center;
}

.hero-image-wrapper {
  width: 100%;
  max-width: 520px;

  border-radius: 36px;

  border: 1px solid #e2e8f0;

  background: #ffffff;

  overflow: hidden;

  box-shadow:
    0 30px 60px rgba(15, 23, 42, 0.08);

  padding: 18px;
}

.hero-image {
  width: 100%;
  height: auto;

  display: block;

  object-fit: contain;
  object-position: center;

  border-radius: 22px;

  background: #f8fafc;
}

/* TABLET */
@media (max-width: 1100px) {

  .hero {
    padding: 100px 0 80px;
  }

  .hero-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-content h1 {
    font-size: 62px;
  }

  .hero-image-wrapper {
    max-width: 560px;
  }

}

/* MOBILE */
@media (max-width: 768px) {

  .hero {
    padding: 80px 0 60px;
  }

  .hero-grid {
    gap: 40px;
  }

  .hero-content h1 {
    font-size: 44px;
    line-height: 1.08;
  }

  .subhead {
    font-size: 16px;
    line-height: 1.8;
  }

  .stats {
    gap: 24px;
    flex-wrap: wrap;
  }

  .stat-item::after {
    display: none;
  }

  .stat-item h3 {
    font-size: 30px;
  }

  .hero-image-wrapper {
    max-width: 100%;
    padding: 12px;
    border-radius: 26px;
  }

  .hero-image {
    border-radius: 18px;
  }

  .primary-btn {
    width: 100%;
    justify-content: center;
  }

}
</style>
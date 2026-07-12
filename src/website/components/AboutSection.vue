<template>
  <section
    class="about"
    id="about"
  >
    <div class="container">

      <!-- HEADER -->
      <div class="section-header">

        <div class="badge">
          Tentang Yayasan
        </div>

        <h2>
          Ekosistem Pendidikan Islam
          <span>Modern & Profesional</span>
        </h2>

        <p>
          Yayasan Dakwah Imam Nawawi menghadirkan lingkungan kerja
          profesional berbasis nilai-nilai Islam, kolaborasi,
          teknologi pendidikan, dan pengembangan SDM berkelanjutan.
        </p>

      </div>

      <!-- CONTENT -->
      <div class="about-grid">

        <!-- IMAGE -->
        <div class="about-image-wrapper">

          <img
            :src="aboutImage"
            alt="Pelatihan Guru dan Staff"
            class="about-image"
          />

        </div>

        <!-- RIGHT CONTENT -->
        <div class="about-content">

          <div class="feature-card">
            <div class="feature-line"></div>

            <div class="feature-body">
              <h3>Lingkungan Islami</h3>

              <p>
                Budaya kerja berbasis adab, akhlak,
                profesionalisme, dan nilai-nilai keislaman.
              </p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-line"></div>

            <div class="feature-body">
              <h3>Kolaborasi Tim</h3>

              <p>
                Lingkungan kerja yang suportif,
                kolaboratif, dan saling berkembang bersama.
              </p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-line"></div>

            <div class="feature-body">
              <h3>Teknologi Pendidikan</h3>

              <p>
                Integrasi teknologi modern
                untuk pendidikan dan dakwah digital.
              </p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-line"></div>

            <div class="feature-body">
              <h3>Pengembangan Karier</h3>

              <p>
                Program training, leadership,
                dan pengembangan kompetensi SDM.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import aboutImage
from '@/assets/images/about-team.jpg'
</script>

<style scoped>
.about {
  padding: 120px 0;
  background: #FFFFFF;
}

.container {
  width: min(1180px, 92%);
  margin: auto;
}

/* HEADER */
.section-header {
  max-width: 760px;
  margin-bottom: 70px;
}

.badge {
  display: inline-flex;
  align-items: center;

  padding: 8px 18px;

  border-radius: 999px;

  background: #F0FDF4;

  border: 1px solid #DCFCE7;

  color: #0F766E;

  font-size: 13px;
  font-weight: 700;

  letter-spacing: .08em;
  text-transform: uppercase;

  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 56px;
  line-height: 1.08;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 24px;

  letter-spacing: -0.04em;
}

.section-header h2 span {
  color: #0F766E;
}

.section-header p {
  font-size: 18px;
  line-height: 1.9;

  color: #475569;

  max-width: 720px;
}

/* GRID */
.about-grid {
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 40px;
  align-items: stretch;
}

/* IMAGE */
.about-image-wrapper {
  background: #FFFFFF;

  border: 1px solid #E2E8F0;

  border-radius: 36px;

  overflow: hidden;

  padding: 24px;

  min-height: 760px;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.05);
}

.about-image {
  width: 100%;
  height: 100%;

  object-fit: contain;

  display: block;
}

/* CONTENT */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-card {
  background: #FFFFFF;

  border: 1px solid #E2E8F0;

  border-radius: 28px;

  padding: 32px;

  display: flex;
  gap: 20px;

  transition: all .3s ease;

  box-shadow:
    0 8px 30px rgba(15, 23, 42, 0.03);
}

.feature-card:hover {
  transform: translateY(-5px);

  border-color: #CBD5E1;

  box-shadow:
    0 20px 40px rgba(15, 23, 42, 0.06);
}

.feature-line {
  width: 4px;
  border-radius: 999px;

  background:
    linear-gradient(
      to bottom,
      #0F766E,
      #14B8A6
    );

  flex-shrink: 0;
}

.feature-body h3 {
  font-size: 24px;
  line-height: 1.4;
  font-weight: 700;

  color: #0F172A;

  margin-bottom: 12px;
}

.feature-body p {
  font-size: 16px;
  line-height: 1.9;

  color: #64748B;
}

/* TABLET */
@media (max-width: 1100px) {

  .about-grid {
    grid-template-columns: 1fr;
  }

  .section-header h2 {
    font-size: 46px;
  }

  .about-image-wrapper {
    min-height: auto;
  }

}

/* MOBILE */
@media (max-width: 768px) {

  .about {
    padding: 90px 0;
  }

  .section-header {
    margin-bottom: 50px;
  }

  .section-header h2 {
    font-size: 38px;
  }

  .section-header p {
    font-size: 16px;
    line-height: 1.8;
  }

  .about-grid {
    gap: 30px;
  }

  .about-image-wrapper {
    padding: 14px;
    border-radius: 24px;
  }

  .feature-card {
    padding: 24px;
  }

  .feature-body h3 {
    font-size: 20px;
  }

  .feature-body p {
    font-size: 15px;
  }

}
</style>
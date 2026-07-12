<template>
  <section
    class="benefits"
    id="benefits"
  >

    <div class="container">

      <!-- HEADER -->
      <div class="section-header">

        <div class="badge">
          Benefit & Lingkungan Kerja
        </div>

        <h2>
          Bertumbuh Bersama
          <span>Tim Profesional & Islami</span>
        </h2>

        <p>
          Yayasan Dakwah Imam Nawawi menghadirkan lingkungan kerja
          modern yang mendukung pengembangan karier, dakwah,
          pendidikan, dan kesejahteraan tim.
        </p>

      </div>

      <!-- GRID -->
      <div class="benefits-grid">

        <div
          class="benefit-card"
          v-for="benefit in benefits"
          :key="benefit.title"
        >

          <div class="icon-box">
            <span>{{ benefit.icon }}</span>
          </div>

          <h3>
            {{ benefit.title }}
          </h3>

          <p>
            {{ benefit.description }}
          </p>

        </div>

      </div>

    </div>

  </section>
</template>

<script setup lang="ts">
const benefits = [

  {
    icon: '🕌',
    title: 'Lingkungan Kerja Islami',
    description:
      'Budaya kerja kekeluargaan yang mendukung adab, akhlak, dan nilai-nilai Islam.'
  },

  {
    icon: '📖',
    title: 'Kesempatan Menuntut Ilmu',
    description:
      'Mendapatkan pembinaan, dauroh, kajian, dan kesempatan berkembang dalam dakwah.'
  },

  {
    icon: '📚',
    title: 'Program Training & Upgrading',
    description:
      'Pelatihan rutin untuk meningkatkan kompetensi pendidikan, administrasi, dan teknologi.'
  },

  {
    icon: '🎓',
    title: 'Subsidi Pendidikan Anak',
    description:
      'Tersedia subsidi biaya pendidikan anak sesuai kebijakan yayasan.'
  },

 

  {
    icon: '🌙',
    title: 'Cuti & Hari Libur',
    description:
      'Libur Idul Fitri, cuti tahunan, dan kebijakan kerja yang memperhatikan keseimbangan hidup.'
  },

  {
    icon: '💻',
    title: 'Teknologi Pendidikan',
    description:
      'Menggunakan sistem pembelajaran dan administrasi berbasis teknologi modern.'
  },

  {
    icon: '🤝',
    title: 'Tim Supportif',
    description:
      'Lingkungan kerja profesional, kolaboratif, dan saling mendukung antar divisi.'
  }

]
</script>

<style scoped>
.benefits {
  padding: 110px 0;
  background: #f8fafc;
}

.container {
  width: min(1180px, 92%);
  margin: auto;
}

/* HEADER */
.section-header {
  text-align: center;

  max-width: 760px;

  margin:
    0 auto
    70px;
}

.badge {
  display: inline-flex;
  align-items: center;

  padding: 8px 16px;

  border-radius: 999px;

  background: #ecfdf5;

  border: 1px solid #d1fae5;

  color: #0f766e;

  font-size: 13px;
  font-weight: 700;

  margin-bottom: 22px;
}

.section-header h2 {
  font-size: 52px;
  line-height: 1.1;

  letter-spacing: -0.04em;

  font-weight: 800;

  color: #0f172a;

  margin-bottom: 22px;
}

.section-header h2 span {
  color: #0f766e;
}

.section-header p {
  font-size: 18px;
  line-height: 1.9;

  color: #64748b;
}

/* GRID */
.benefits-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 26px;
}

/* CARD */
.benefit-card {
  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 30px;

  padding: 32px;

  transition: .3s ease;

  position: relative;

  overflow: hidden;
}

.benefit-card::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 4px;

  background:
    linear-gradient(
      90deg,
      #0f766e,
      #14b8a6
    );

  opacity: 0;

  transition: .3s ease;
}

.benefit-card:hover {
  transform: translateY(-8px);

  border-color: #d1fae5;

  box-shadow:
    0 24px 50px rgba(15, 23, 42, 0.08);
}

.benefit-card:hover::before {
  opacity: 1;
}

/* ICON */
.icon-box {
  width: 70px;
  height: 70px;

  border-radius: 22px;

  background: #ecfdf5;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 24px;
}

.icon-box span {
  font-size: 34px;
}

/* TEXT */
.benefit-card h3 {
  font-size: 22px;
  line-height: 1.4;

  font-weight: 700;

  color: #0f172a;

  margin-bottom: 14px;
}

.benefit-card p {
  font-size: 15px;
  line-height: 1.9;

  color: #64748b;
}

/* TABLET */
@media (max-width: 1100px) {

  .benefits-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .section-header h2 {
    font-size: 44px;
  }

}

/* MOBILE */
@media (max-width: 768px) {

  .benefits {
    padding: 80px 0;
  }

  .section-header {
    margin-bottom: 50px;
  }

  .section-header h2 {
    font-size: 36px;
  }

  .section-header p {
    font-size: 16px;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .benefit-card {
    padding: 26px;
    border-radius: 24px;
  }

  .icon-box {
    width: 60px;
    height: 60px;
  }

  .icon-box span {
    font-size: 28px;
  }

  .benefit-card h3 {
    font-size: 20px;
  }

}
</style>
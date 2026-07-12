<template>
  <div class="landing-page">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <BenefitSection />
    <CareerSection />
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue'
import HeroSection from '../components/HeroSection.vue'
import AboutSection from '../components/AboutSection.vue'
import BenefitSection from '../components/BenefitSection.vue'
import CareerSection from '../components/CareerSection.vue'
import FooterSection from '../components/FooterSection.vue'
</script>

<style scoped>
.landing-page {
  width: 100%;
  overflow-x: hidden;
}
</style>
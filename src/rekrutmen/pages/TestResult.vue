<template>
  <div class="result-page">
    <div v-if="store.loading" class="loading">Memuat hasil...</div>
    <div v-else-if="store.error" class="error">{{ store.error }}</div>
    <div v-else-if="store.result">
      <h1>Hasil Tes</h1>
      <p>Total Skor: {{ store.result.total_score }}</p>
      <p>Status: {{ store.result.passed ? 'LULUS' : 'TIDAK LULUS' }}</p>
      <p>Tanggal Submit: {{ store.result.created_at }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTestSessionStore } from '../stores/useTestSessionStore';

const route = useRoute();
const store = useTestSessionStore();
const attemptId = route.params.attemptId as string;

onMounted(async () => {
  await store.fetchScore(attemptId);
});
</script>
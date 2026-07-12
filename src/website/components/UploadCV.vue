<template>
  <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
    <input type="file" ref="fileInput" @change="handleFile" :accept="accept" style="display:none" />
    <div class="upload-content" @click="triggerFile">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="1.5"><path d="M12 16v-6M8 10l4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
      <p>Klik atau tarik file ke sini</p>
      <span>{{ label }}</span>
    </div>
    <div v-if="filePreview" class="file-preview">{{ filePreview.name }} ({{ (filePreview.size/1024).toFixed(1) }} KB)</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ accept?: string; label?: string }>()
const emit = defineEmits<{ (e: 'update:cvFile', file: File | null): void }>()
const fileInput = ref<HTMLInputElement>()
const filePreview = ref<File | null>(null)

function triggerFile() { fileInput.value?.click() }
function handleFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) { filePreview.value = file; emit('update:cvFile', file) }
}
function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files[0]
  if (file) { filePreview.value = file; emit('update:cvFile', file) }
}
</script>

<style scoped>
.upload-area { border: 2px dashed #E2E8F0; border-radius: 20px; background: #F8FAFC; padding: 24px; text-align: center; cursor: pointer; transition: 0.2s; margin-bottom: 20px; }
.upload-area:hover { border-color: #0F766E; background: #F0FDF9; }
.upload-content svg { margin-bottom: 12px; }
.file-preview { margin-top: 12px; font-size: 13px; background: white; padding: 8px; border-radius: 12px; }
</style>
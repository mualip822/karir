<template>
  <div class="messages-page">
    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Pesan Masuk</h1>
        <p v-if="store.unreadCount > 0" class="unread-hint">
          {{ store.unreadCount }} pesan belum dibaca
        </p>
      </div>
    </div>

    <!-- STATES -->
    <div v-if="store.loading" class="state-box">
      <div class="spinner" />
      <p>Memuat pesan...</p>
    </div>

    <div v-else-if="store.error" class="state-box error-state">
      <p>⚠️ {{ store.error }}</p>
    </div>

    <div v-else-if="store.messages.length === 0" class="state-box empty-state">
      <p>📭 Tidak ada pesan masuk.</p>
    </div>

    <!-- MESSAGE LIST -->
    <div v-else class="message-list">
      <div
        v-for="message in sortedMessages"
        :key="message.id"
        class="message-card"
        :class="{
          unread: !message.is_read,
          active: selectedId === message.id,
        }"
        @click="handleClick(message)"
      >
        <!-- ROW UTAMA -->
        <div class="msg-row">
          <div class="msg-content">
            <div class="msg-top">
              <span class="subject">{{ message.subject }}</span>
              <span class="badge" :class="message.is_read ? 'read' : 'unread'">
                {{ message.is_read ? 'Dibaca' : 'Baru' }}
              </span>
            </div>
            <p class="preview">
              {{ message.body.substring(0, 120)
              }}{{ message.body.length > 120 ? '...' : '' }}
            </p>
          </div>
          <span class="date">{{ formatDate(message.created_at) }}</span>
        </div>

        <!-- DETAIL (EXPANDED) -->
        <Transition name="expand">
          <div v-if="selectedId === message.id" class="detail">
            <hr />
            <p class="full-body">{{ message.body }}</p>

            <div v-if="loadingAssignment" class="loading-pill">
              <span class="spinner small" /> Memuat tes...
            </div>

            <div v-else-if="testAssignment" class="test-card">
  <div class="test-info">
    <h4>{{ testAssignment.test.title }}</h4>
    <p>{{ testAssignment.test.description }}</p>

    <span class="duration">
      ⏱️ {{ testAssignment.test.duration_minutes }} menit
    </span>

    <p class="status">
      Status :
      <strong>{{ testAssignment.assignment.status }}</strong>
    </p>
  </div>

  <button
    v-if="testAssignment.assignment.status !== 'completed'"
    class="btn-start"
    @click.stop="mulaiTest(testAssignment.test.id)"
  >
    Kerjakan Tes →
  </button>

  <div
    v-else
    class="completed-badge"
  >
    ✅ Tes sudah selesai
  </div>
</div>

            <div v-else class="no-test">
              Tidak ada tes terkait.
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '../stores/useMessageStore'
import { candidateTestRepository } from '../repositories/candidateTestRepository'
import { attemptService } from '../services/attemptService'
import type { Message } from '../types/message.types'
import type { TestWithAssignment } from '../types/test.types'

const router = useRouter()
const store = useMessageStore()
const selectedId = ref<string | null>(null)
const loadingAssignment = ref(false)
const testAssignment = ref<TestWithAssignment | null>(null)

const sortedMessages = computed(() =>
  [...store.messages].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
)

const handleClick = async (message: Message) => {
  if (selectedId.value === message.id) {
    selectedId.value = null
    testAssignment.value = null
    return
  }

  selectedId.value = message.id

  try {
    loadingAssignment.value = true
    const assignment = await candidateTestRepository.getAssignmentByMessage(message.id)
    testAssignment.value = assignment
  } catch (err) {
    console.error('Assignment gagal dimuat', err)
    testAssignment.value = null
  } finally {
    loadingAssignment.value = false
  }

  if (!message.is_read) {
    await store.markAsRead(message.id)
  }
}

const mulaiTest = async (testId: string) => {
  try {
    const attempt = await attemptService.start(testId);

    console.log('ATTEMPT:', attempt);

    if (!attempt?.id) {
      throw new Error('Attempt ID tidak ditemukan dari server');
    }

    router.push({
  name: 'kerjakan-test',
  params: {
    attemptId: attempt.id,
  },
});

  } catch (err: any) {
    console.error('Gagal memulai test', err);

    const msg = err?.message || '';

    if (msg.includes('sudah dimulai')) {
      alert('Test sudah dimulai, lanjut ke halaman test');
      return;
    }

    alert('Gagal memulai test. Silakan coba lagi.');
  }
};
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  store.fetchMessages()
})
</script>

<style scoped>
/* ===== GLOBAL RESET (SCOPED) ===== */
.messages-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 32px 20px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}
.status {
  margin-top: 8px;
  font-size: 13px;
  color: #64748b;
}

.completed-badge {
  background: #dcfce7;
  color: #166534;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
}
/* ===== HEADER ===== */
.page-header {
  margin-bottom: 32px;
}
.page-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #0f172a;
  margin: 0 0 4px;
}
.unread-hint {
  margin: 0;
  font-size: 14px;
  color: #6366f1;
  font-weight: 500;
}
.completed-badge {
  background: #dcfce7;
  color: #166534;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
}
/* ===== STATES ===== */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 15px;
}
.error-state {
  border-color: #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-bottom: 12px;
}
.spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  margin: 0 8px 0 0;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== MESSAGE LIST ===== */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ===== CARD ===== */
.message-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}
.message-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
.message-card.unread {
  border-left: 4px solid #6366f1;
  background: #f8faff;
}
.message-card.active {
  border-color: #6366f1;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.08);
}

/* ===== ROW UTAMA ===== */
.msg-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.msg-content {
  flex: 1;
  min-width: 0;
}
.msg-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.subject {
  font-weight: 600;
  font-size: 16px;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  white-space: nowrap;
}
.badge.unread {
  background: #e0e7ff;
  color: #4338ca;
}
.badge.read {
  background: #f1f5f9;
  color: #64748b;
}
.preview {
  margin: 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.date {
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
  margin-top: 4px;
}

/* ===== DETAIL (EXPAND) ===== */
.detail {
  margin-top: 16px;
  overflow: hidden;
}
.detail hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 0 0 16px;
}
.full-body {
  font-size: 14px;
  line-height: 1.7;
  color: #334155;
  white-space: pre-wrap;
  margin: 0 0 20px;
}

/* ===== TEST CARD DALAM DETAIL ===== */
.test-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  gap: 20px;
  flex-wrap: wrap;
}
.test-info h4 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}
.test-info p {
  margin: 0 0 8px;
  font-size: 14px;
  color: #475569;
}
.duration {
  font-size: 13px;
  color: #6366f1;
  font-weight: 500;
}
.btn-start {
  background: #6366f1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-start:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}
.btn-start:active {
  transform: translateY(0);
}

/* ===== LOADING PILL ===== */
.loading-pill {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #475569;
  padding: 12px 0;
}
.no-test {
  font-size: 13px;
  color: #94a3b8;
  padding: 8px 0;
}

/* ===== TRANSISI EXPAND ===== */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
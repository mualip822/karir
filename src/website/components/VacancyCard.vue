<template>
  <div class="vacancy-card" @click="$emit('view-detail', job)">
    <div class="card-header">
      <div class="company-logo">
        <img :src="logoImg" alt="Logo" class="logo-img" />
      </div>
      <div class="title-block">
        <h3 class="job-title">{{ job.title }}</h3>
        <div class="company-name">{{ job.company }}</div>
      </div>
      <div class="type-badge" :class="getTypeClass(job.type)">{{ job.type }}</div>
    </div>

    <div class="card-body">
      <div class="info-row">
        <div class="info-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21C7.58 21 4 17.42 4 13C4 8.58 7.58 5 12 5s8 3.58 8 8c0 2.21-4 8-8 8z"/><path d="M12 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>
          {{ job.location }}
        </div>
        <div class="info-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6"/></svg>
          {{ job.salary }}
        </div>
      </div>
      <div class="badges-row">
        <span class="badge badge-category" v-if="job.category">{{ job.category }}</span>
        <span class="badge badge-experience">{{ job.experience }}</span>
        <span class="badge badge-education">{{ job.education }}</span>
      </div>
      <div class="skills-row">
        <span v-for="skill in job.skills.slice(0, 3)" :key="skill" class="skill-tag">{{ skill }}</span>
        <span v-if="job.skills.length > 3" class="skill-tag skill-more">+{{ job.skills.length - 3 }}</span>
      </div>
    </div>

    <div class="card-footer">
      <span class="posted">Diposting {{ formatRelative(job.postedAt) }}</span>
      <span class="deadline" v-if="job.deadline">{{ formatDeadline(job.deadline) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Job } from '../types/jobs.types'
import { JobsService } from '../services/jobs.service'
import logoImg from '../../assets/images/logo.jpg'

const props = defineProps<{ job: Job }>()
defineEmits<{ (e: 'view-detail', job: Job): void }>()

function getTypeClass(type: string): string {
  const lower = type.toLowerCase()
  if (lower.includes('full')) return 'fulltime'
  if (lower.includes('part')) return 'parttime'
  if (lower.includes('kontrak') || lower.includes('contract')) return 'contract'
  if (lower.includes('magang') || lower.includes('intern')) return 'internship'
  return 'fulltime'
}

function formatRelative(d: string) { return JobsService.formatRelativeDate(d) }
function formatDeadline(d: string | null) { return JobsService.formatDeadline(d) }
</script>

<style scoped>
.vacancy-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.vacancy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
  border-color: #cbd5e1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}
.company-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  flex-shrink: 0;
  border: 1px solid #f1f5f9;
}
.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.title-block {
  flex: 1;
  min-width: 0;
}
.job-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.company-name {
  font-size: 0.875rem;
  color: #475569;
}
.type-badge {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.01em;
}
.fulltime { background: #e0f2fe; color: #0369a1; }
.parttime { background: #dcfce7; color: #15803d; }
.contract { background: #fef3c7; color: #b45309; }
.internship { background: #f3e8ff; color: #7e22ce; }

.card-body {
  flex: 1;
}
.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}
.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #334155;
}
.info-item svg {
  color: #64748b;
  flex-shrink: 0;
}
.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f1f5f9;
  color: #334155;
}
.badge-category {
  background: #ecfdf5;
  color: #0f766e;
}
.skills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skill-tag {
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 999px;
  font-size: 0.75rem;
  color: #475569;
}
.skill-more {
  background: #e2e8f0;
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  font-size: 0.75rem;
  color: #94a3b8;
}
.deadline {
  color: #ef4444;
  font-weight: 500;
}
</style>
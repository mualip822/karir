import { ref, computed } from 'vue';
import type { Job, JobFiltersPublic } from '../types/jobs.types';
import jobsRepository, { type JobTypeOption } from '../repositories/jobs.repository';

export function useJobs() {
  const jobs = ref<Job[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const searchQuery = ref('');
  const filters = ref<JobFiltersPublic>({
    location: '',
    division: '',
    category: '',
    type: '',
  });

  // Tipe pekerjaan diambil dari master data backend
  const jobTypes = ref<JobTypeOption[]>([]);

  const hasActiveFilters = computed(() => {
    return !!(searchQuery.value || filters.value.location || filters.value.division || filters.value.category || filters.value.type);
  });

  const uniqueLocations = computed(() => {
    const locs = jobs.value.map(j => j.location).filter(Boolean);
    return [...new Set(locs)].sort();
  });
  const uniqueDivisions = computed(() => {
    const divs = jobs.value.map(j => j.division).filter(Boolean);
    return [...new Set(divs)].sort();
  });
  const uniqueCategories = computed(() => {
    const cats = jobs.value.map(j => j.category).filter(Boolean);
    return [...new Set(cats)].sort();
  });
  const uniqueJobTypes = computed(() => {
    return jobTypes.value.map(t => t.name).sort();
  });

  const filteredJobs = computed(() => {
    let result = [...jobs.value];

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q)) ||
        j.category.toLowerCase().includes(q)
      );
    }

    if (filters.value.location) {
      result = result.filter(j => j.location.toLowerCase() === filters.value.location.toLowerCase());
    }
    if (filters.value.division) {
      result = result.filter(j => j.division.toLowerCase() === filters.value.division.toLowerCase());
    }
    if (filters.value.category) {
      result = result.filter(j => j.category.toLowerCase() === filters.value.category.toLowerCase());
    }
    if (filters.value.type) {
      result = result.filter(j => j.type === filters.value.type);
    }

    return result;
  });

  async function fetchJobs() {
    loading.value = true;
    error.value = null;
    try {
      jobs.value = await jobsRepository.getAll();
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat lowongan';
    } finally {
      loading.value = false;
    }
  }

  async function fetchJobTypes() {
    try {
      jobTypes.value = await jobsRepository.getJobTypes();
    } catch {
      jobTypes.value = [];
    }
  }

  function updateSearch(val: string) {
    searchQuery.value = val;
  }

  function resetFilters() {
    searchQuery.value = '';
    filters.value = { location: '', division: '', category: '', type: '' };
  }

  function retryFetch() {
    fetchJobs();
  }

  // Initial fetch
  fetchJobs();
  fetchJobTypes();

  return {
    jobs,
    loading,
    error,
    searchQuery,
    filters,
    uniqueLocations,
    uniqueDivisions,
    uniqueCategories,
    uniqueJobTypes,
    filteredJobs,
    hasActiveFilters,
    resetFilters,
    updateSearch,
    retryFetch,
    fetchJobs,
  };
}
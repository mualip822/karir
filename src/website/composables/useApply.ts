import {
  ref,
  computed,
} from "vue";

import { ApplyService }
from "../services/apply.service";

import type {
  ApplyPayload,
  UploadFiles,
} from "../types/apply.types";

export function useApply() {

  const profile =
    ref<any>(null);

  const jobs =
    ref<any[]>([]);

  const loading =
    ref({
      profile: false,
      jobs: false,
      submit: false,
    });

  const error =
    ref("");

  const distinctLocations =
    computed(() => {

      const locations =
        jobs.value.map(
          (job) =>
            job.lokasi
        );

      return [
        ...new Set(locations),
      ];
    });

  async function loadProfile(
    token: string
  ) {
    try {

      loading.value.profile =
        true;

      const result =
        await ApplyService
          .getProfile(token);

      profile.value =
        result.data;

    } catch (err: any) {

      error.value =
        err.message;

    } finally {

      loading.value.profile =
        false;
    }
  }

  async function loadJobs() {
    try {

      loading.value.jobs =
        true;

      const result =
        await ApplyService
          .getJobs();

      jobs.value =
        result.data || [];

    } catch (err: any) {

      error.value =
        err.message;

    } finally {

      loading.value.jobs =
        false;
    }
  }

  async function submit(
    token: string,
    payload: ApplyPayload,
    files: UploadFiles
  ) {

    try {

      loading.value.submit =
        true;

      return await ApplyService
        .submit(
          token,
          payload,
          files
        );

    } finally {

      loading.value.submit =
        false;
    }
  }

  return {

    profile,

    jobs,

    loading,

    error,

    distinctLocations,

    loadProfile,

    loadJobs,

    submit,
  };
}
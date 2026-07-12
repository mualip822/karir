import { defineStore } from "pinia";

import profileService from "../services/profileService";

import type { Profile } from "../types/profile.types";

export const useProfileStore =
  defineStore("profile", {
    state: () => ({
      profile: null as Profile | null,

      loading: false,
    }),

    actions: {
      async fetchProfile() {
        this.loading = true;

        try {
          const response =
            await profileService.getProfile();

          this.profile = response.data;

          return response.data;
        } finally {
          this.loading = false;
        }
      },

      async saveProfile(
        formData: FormData
      ) {
        this.loading = true;

        try {
          const response =
            await profileService.saveProfile(
              formData
            );

          this.profile = response.data;

          return response.data;
        } finally {
          this.loading = false;
        }
      },

      async deleteProfile() {
        this.loading = true;

        try {
          const response =
            await profileService.deleteProfile();

          this.profile = null;

          return response;
        } finally {
          this.loading = false;
        }
      },
    },
  });
import repository from "../repositories/profileRepository";

export default {
  async getProfile() {
    return await repository.getProfile();
  },

  async saveProfile(
    formData: FormData
  ) {
    return await repository.saveProfile(
      formData
    );
  },

  async deleteProfile() {
    return await repository.deleteProfile();
  },
};
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default {
  async getProfile() {
    const response =
      await API.get("/profile");

    return response.data;
  },

  async saveProfile(
    formData: FormData
  ) {
    const response = await API.put(
      "/profile",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async deleteProfile() {
    const response =
      await API.delete("/profile");

    return response.data;
  },
};
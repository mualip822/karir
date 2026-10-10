import axios from "axios";
import type {
  ApplyPayload,
  UploadFiles,
} from "../types/apply.types";

// =====================================================
// API CONFIG
// =====================================================

const API_URL = import.meta.env.VITE_API_URL;

console.log("[ApplyRepository] API URL:", API_URL);

// =====================================================
// AXIOS CLIENT
// =====================================================

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// =====================================================
// APPLY REPOSITORY
// =====================================================

export const ApplyRepository = {

  // ===================================================
  // SUBMIT LAMARAN
  // POST /apply
  // ===================================================

  async submit(
    token: string,
    payload: ApplyPayload,
    files: UploadFiles
  ) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (files.cv) {
      formData.append("cv", files.cv);
    }

    if (files.ijazah) {
      formData.append("ijazah", files.ijazah);
    }

    if (files.transkrip) {
      formData.append("transkrip", files.transkrip);
    }

    if (files.pendukung) {
      formData.append("pendukung", files.pendukung);
    }

    const response = await apiClient.post(
      "/apply",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ===================================================
  // GET MY APPLICATIONS
  // GET /apply/my-applications
  // ===================================================

  async getMyApplications(token: string) {
    const response = await apiClient.get(
      "/apply/my-applications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // ===================================================
  // GET DETAIL APPLICATION
  // GET /apply/:id
  // ===================================================

  async getDetail(
    token: string,
    id: number
  ) {
    const response = await apiClient.get(
      `/apply/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // ===================================================
  // GET PROFILE
  // ===================================================

  async getProfile(token: string) {
    const response = await apiClient.get(
      "/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // ===================================================
  // GET LOWONGAN
  // GET /rekrutmen
  // ===================================================

  async getJobs() {
    const response = await apiClient.get(
      "/rekrutmen"
    );

    return response.data;
  },
};

export default ApplyRepository;
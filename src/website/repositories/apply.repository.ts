import axios from "axios";
import type {
  ApplyPayload,
  UploadFiles,
} from "../types/apply.types";

const API_URL =
  `${import.meta.env.VITE_API_URL}/apply`

export const ApplyRepository = {
  async submit(
    token: string,
    payload: ApplyPayload,
    files: UploadFiles
  ) {
    const formData = new FormData();

    Object.entries(payload).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null
        ) {
          formData.append(
            key,
            String(value)
          );
        }
      }
    );

    if (files.cv)
      formData.append(
        "cv",
        files.cv
      );

    if (files.ijazah)
      formData.append(
        "ijazah",
        files.ijazah
      );

    if (files.transkrip)
      formData.append(
        "transkrip",
        files.transkrip
      );

    if (files.pendukung)
      formData.append(
        "pendukung",
        files.pendukung
      );

    const response =
      await axios.post(
        API_URL,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },

  async getMyApplications(
    token: string
  ) {
    const response =
      await axios.get(
        `${API_URL}/my-applications`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  },

  async getDetail(
    token: string,
    id: number
  ) {
    const response =
      await axios.get(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  },

  async getProfile(
    token: string
  ) {
    const response =
      await axios.get(
        `${import.meta.env.VITE_API_URL}/profile`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  },

  async getJobs() {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/rekrutmen/lowongan`
  );

  return response.data;
}
};
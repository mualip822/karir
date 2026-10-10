import axios from "../../../shared/utils/axios";

import type {
  TodayPresensiResponse,
  PresensiHistoryResponse,
  FaceStatus,
  FaceRegisterResponse,
  FaceVerifyResponse,
  PresensiActionResponse,
} from "../types/presensi.types";

class PresensiRepository {
  async getToday(): Promise<TodayPresensiResponse> {
    const response = await axios.get(
      "/presensi/me",
    );

    return (
      response.data?.data ??
      response.data
    );
  }

  async getHistory(
    page = 1,
    limit = 10,
  ): Promise<PresensiHistoryResponse> {
    const response = await axios.get(
      "/presensi/history",
      {
        params: {
          page,
          limit,
        },
      },
    );

    return (
      response.data?.data ??
      response.data
    );
  }

  async getShifts() {
    const response = await axios.get(
      "/presensi/shifts",
    );

    return (
      response.data?.data ??
      response.data
    );
  }

  async getFaceStatus(): Promise<FaceStatus> {
    const response = await axios.get(
      "/presensi/face/status",
    );

    return (
      response.data?.data ??
      response.data
    );
  }

  async registerFace(
    file: Blob,
  ): Promise<FaceRegisterResponse> {
    const formData = new FormData();

    formData.append(
      "foto",
      file,
      "face-registration.jpg",
    );

    const response = await axios.post(
      "/presensi/face/register",
      formData,
    );

    return (
      response.data?.data ??
      response.data
    );
  }

  async verifyFace(
    file: Blob,
  ): Promise<FaceVerifyResponse> {
    const formData = new FormData();

    formData.append(
      "foto",
      file,
      "face-verification.jpg",
    );

    const response = await axios.post(
      "/presensi/face/verify",
      formData,
    );

    return (
      response.data?.data ??
      response.data
    );
  }

  async checkIn(payload: {
    foto?: Blob | null;
    latitude?: number | null;
    longitude?: number | null;
    alamat?: string | null;
    metode?: string;
    catatan?: string | null;
  }): Promise<PresensiActionResponse> {
    const formData = new FormData();

    if (payload.foto) {
      formData.append(
        "foto",
        payload.foto,
        "presensi-masuk.jpg",
      );
    }

    if (
      payload.latitude !== undefined &&
      payload.latitude !== null
    ) {
      formData.append(
        "latitude",
        String(payload.latitude),
      );
    }

    if (
      payload.longitude !== undefined &&
      payload.longitude !== null
    ) {
      formData.append(
        "longitude",
        String(payload.longitude),
      );
    }

    if (payload.alamat) {
      formData.append(
        "alamat",
        payload.alamat,
      );
    }

    if (payload.metode) {
      formData.append(
        "metode",
        payload.metode,
      );
    }

    if (payload.catatan) {
      formData.append(
        "catatan",
        payload.catatan,
      );
    }

    const response = await axios.post(
      "/presensi/check-in",
      formData,
    );

    return (
      response.data?.data ??
      response.data
    );
  }

  async checkOut(payload: {
    foto?: Blob | null;
    latitude?: number | null;
    longitude?: number | null;
    alamat?: string | null;
    metode?: string;
    catatan?: string | null;
  }): Promise<PresensiActionResponse> {
    const formData = new FormData();

    if (payload.foto) {
      formData.append(
        "foto",
        payload.foto,
        "presensi-pulang.jpg",
      );
    }

    if (
      payload.latitude !== undefined &&
      payload.latitude !== null
    ) {
      formData.append(
        "latitude",
        String(payload.latitude),
      );
    }

    if (
      payload.longitude !== undefined &&
      payload.longitude !== null
    ) {
      formData.append(
        "longitude",
        String(payload.longitude),
      );
    }

    if (payload.alamat) {
      formData.append(
        "alamat",
        payload.alamat,
      );
    }

    if (payload.metode) {
      formData.append(
        "metode",
        payload.metode,
      );
    }

    if (payload.catatan) {
      formData.append(
        "catatan",
        payload.catatan,
      );
    }

    const response = await axios.post(
      "/presensi/check-out",
      formData,
    );

    return (
      response.data?.data ??
      response.data
    );
  }
}

export default new PresensiRepository();
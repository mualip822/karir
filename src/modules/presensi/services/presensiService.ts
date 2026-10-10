import presensiRepository from "../repositories/presensiRepository";

class PresensiService {
  async getToday() {
    return await presensiRepository.getToday();
  }

  async getHistory(page = 1, limit = 10) {
    return await presensiRepository.getHistory(page, limit);
  }

  async getShifts() {
    return await presensiRepository.getShifts();
  }

  async getFaceStatus() {
    return await presensiRepository.getFaceStatus();
  }

  async registerFace(file: Blob) {
    return await presensiRepository.registerFace(file);
  }

  async verifyFace(file: Blob) {
    return await presensiRepository.verifyFace(file);
  }

  async checkIn(payload: {
    foto?: Blob | null;
    latitude?: number | null;
    longitude?: number | null;
    alamat?: string | null;
    metode?: string;
    catatan?: string | null;
  }) {
    return await presensiRepository.checkIn(payload);
  }

  async checkOut(payload: {
    foto?: Blob | null;
    latitude?: number | null;
    longitude?: number | null;
    alamat?: string | null;
    metode?: string;
    catatan?: string | null;
  }) {
    return await presensiRepository.checkOut(payload);
  }

  async getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
  }> {
    if (!navigator.geolocation) {
      throw new Error(
        "Browser tidak mendukung layanan lokasi.",
      );
    }

    return await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let message = "Lokasi tidak tersedia.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message =
                "Akses lokasi ditolak. Silakan izinkan lokasi pada browser.";
              break;

            case error.POSITION_UNAVAILABLE:
              message =
                "Lokasi tidak dapat ditemukan.";
              break;

            case error.TIMEOUT:
              message =
                "Permintaan lokasi terlalu lama. Silakan coba lagi.";
              break;
          }

          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    });
  }
}

export default new PresensiService();
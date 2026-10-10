import type {
  SettingsMenuResponse,
} from "../types/settings.types";

const BASE_URL =
  import.meta.env.VITE_API_URL;

/* ================================================================
   GET MENU USER LOGIN
================================================================ */

export const getSettingsMenuApi =
  async (): Promise<SettingsMenuResponse> => {

    const token =
      localStorage.getItem(
        "token"
      );

    const url =
      `${BASE_URL}/settings/menu`;

    console.log(
      "\n============================================================"
    );

    console.log(
      "[SETTINGS FE] GET USER MENU"
    );

    console.log(
      "API URL:",
      url
    );

    console.log(
      "Token tersedia:",
      !!token
    );

    if (!token) {

      console.log(
        "[SETTINGS FE] Token tidak ditemukan."
      );

      console.log(
        "============================================================\n"
      );

      return {

        success:
          false,

        isEmployee:
          false,

        isActiveEmployee:
          false,

        data:
          [],

      };
    }

    const res =
      await fetch(
        url,
        {
          method:
            "GET",

          headers: {

            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",

          },
        }
      );

    const data =
      await res.json();

    console.log(
      "[SETTINGS FE] RESPONSE:",
      data
    );

    if (
      res.status === 401
    ) {

      console.log(
        "[SETTINGS FE] Unauthorized."
      );

      console.log(
        "============================================================\n"
      );

      return {

        success:
          false,

        isEmployee:
          false,

        isActiveEmployee:
          false,

        data:
          [],

      };
    }

    if (
      !res.ok
    ) {

      throw new Error(
        data?.message ||
        "Gagal mengambil menu settings"
      );
    }

    console.log(
      "[SETTINGS FE] isEmployee:",
      data?.isEmployee
    );

    console.log(
      "[SETTINGS FE] isActiveEmployee:",
      data?.isActiveEmployee
    );

    console.log(
      "[SETTINGS FE] menu:",
      data?.data
    );

    console.log(
      "============================================================\n"
    );

    return data;
  };
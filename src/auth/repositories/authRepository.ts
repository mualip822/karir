
import type { LoginPayload } from "../types/auth.types";

// =====================================================
// API CONFIGURATION
// =====================================================

const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api"
).replace(/\/+$/, "");

// =====================================================
// API RESPONSE
// =====================================================

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const parseResponse = async <T>(res: Response): Promise<T> => {
  const contentType = res.headers.get("content-type") || "";

  let data: unknown;

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();

    data = text
      ? { message: text }
      : {};
  }

  if (!res.ok) {
    const errorData = data as ApiErrorResponse;

    throw new Error(
      errorData.message ||
      errorData.error ||
      `Request gagal (${res.status} ${res.statusText})`
    );
  }

  return data as T;
};

// =====================================================
// EMAIL & PASSWORD LOGIN
// POST /api/auth/login
// =====================================================

export const loginApi = async (
  payload: LoginPayload
) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
};

// =====================================================
// GOOGLE LOGIN
// POST /api/auth/google
// =====================================================

export const googleLoginApi = async (
  token: string
) => {
  if (!token?.trim()) {
    throw new Error("Google token tidak tersedia.");
  }

  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ token }),
  });

  return parseResponse(res);
};

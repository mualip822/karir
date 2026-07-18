import type { LoginPayload } from "../types/auth.types";

// ========================================
// BASE URL
// ========================================
const BASE_URL = import.meta.env.VITE_API_URL;

console.log("====================================");
console.log("API URL :", BASE_URL);
console.log("====================================");

// ========================================
// LOGIN
// ========================================
export const loginApi = async (
  payload: LoginPayload
) => {

  console.log(
    "LOGIN URL =>",
    `${BASE_URL}/auth/login`
  );

  const res = await fetch(
    `${BASE_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  console.log("LOGIN RESPONSE :", data);

  if (!res.ok) {
    throw new Error(
      data.message || "Login gagal"
    );
  }

  return data;
};

// ========================================
// GOOGLE LOGIN
// ========================================
export const googleLoginApi = async (
  token: string
) => {

  console.log(
    "GOOGLE LOGIN URL =>",
    `${BASE_URL}/auth/google`
  );

  console.log("TOKEN :", token);

  const res = await fetch(
    `${BASE_URL}/auth/google`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        token,
      }),
    }
  );

  const data = await res.json();

  console.log("GOOGLE RESPONSE :", data);

  if (!res.ok) {
    throw new Error(
      data.message || "Google login gagal"
    );
  }

  return data;
};
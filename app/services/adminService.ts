import { User } from "@/types/user";

export interface UpdateUserData {
  subscriptionType?: "free" | "premium";
  subscriptionExpires?: string | null;
  role?: "user" | "admin";
}

const BASE_URL = "https://speedhub-6fam.onrender.com/api/admin";

// Функція для витягування accessToken з кук (як на твоєму скріні)
const getCookieToken = () => {
  if (typeof document === "undefined") return null;
  const name = "accessToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

export const adminService = {
  getAllUsers: async (manualToken?: string | null): Promise<User[]> => {
    // Пріоритет: токен з аргументу або токен з кук
    const token = manualToken || getCookieToken();

    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Помилка: ${response.status}`);
    return response.json();
  },

  updateUser: async (
    id: string,
    data: UpdateUserData,
    manualToken?: string | null,
  ): Promise<User> => {
    const token = manualToken || getCookieToken();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Помилка при оновленні");
    return response.json();
  },

  deleteUser: async (
    id: string,
    manualToken?: string | null,
  ): Promise<void> => {
    const token = manualToken || getCookieToken();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Помилка при видаленні");
  },
};

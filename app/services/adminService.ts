import { User } from "@/types/user";

export interface UpdateUserData {
  subscriptionType?: "free" | "premium";
  subscriptionExpires?: string | null;
  role?: "user" | "admin";
}

const BASE_URL = "https://speedhub-6fam.onrender.com/api/admin";

export const adminService = {
  getAllUsers: async (token: string | null): Promise<User[]> => {
    if (!token) throw new Error("Токен відсутній");

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
    token: string | null,
  ): Promise<User> => {
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

  deleteUser: async (id: string, token: string | null): Promise<void> => {
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

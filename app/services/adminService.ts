import { User } from "@/types/user";

export interface UpdateUserData {
  subscriptionType?: "free" | "premium";
  subscriptionExpires?: string | null;
  role?: "user" | "admin";
}

const BASE_URL = "https://speedhub-6fam.onrender.com/api/admin";

export const adminService = {
  /**
   * Отримання всіх користувачів
   */
  getAllUsers: async (token: string | null): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      credentials: "include", 
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Помилка 401: Доступ заборонено");
      throw new Error(`Помилка сервера: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Оновлення даних користувача
   */
  updateUser: async (id: string, data: UpdateUserData, token: string | null): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT", // Або PATCH, залежно від твого бекенду
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error("Помилка при оновленні");
    return response.json();
  },

  /**
   * Видалення користувача
   */
  deleteUser: async (id: string, token: string | null): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) throw new Error("Помилка при видаленні користувача");
    return response.json();
  },

  /**
   * Видалення відгуку
   */
  deleteReview: async (id: string, token: string | null): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/reviews/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) throw new Error("Помилка при видаленні відгуку");
    return response.json();
  }
};
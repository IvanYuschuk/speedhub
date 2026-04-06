import { User } from "@/types/user";

export interface UpdateUserData {
  subscriptionType?: "free" | "premium";
  subscriptionExpires?: string | null;
  role?: "user" | "admin";
}

const BASE_URL = "https://speedhub-6fam.onrender.com/api/admin";

/**
 * Функція для отримання токена з усіх можливих джерел.
 * Оптимізована під суворі правила Safari ITP.
 */
const getToken = () => {
  if (typeof window === "undefined") return null;

  let token = null;

  // 1. Найвищий пріоритет: параметр у URL (працює при редіректі з логіну)
  const params = new URLSearchParams(window.location.search);
  token = params.get("t");

  // 2. Якщо в URL немає, шукаємо в Cookies (твої accessToken)
  if (!token) {
    const allCookies = document.cookie.split('; ');
    const found = allCookies.find(row => 
      row.trim().startsWith('accessToken=') || row.trim().startsWith('token=')
    );
    if (found) {
      token = found.split('=')[1];
    }
  }

  // 3. Останній шанс: LocalStorage
  if (!token) {
    token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  }

  return token;
};

export const adminService = {
  /**
   * Отримання всіх користувачів
   */
  getAllUsers: async (): Promise<User[]> => {
    const token = getToken();
    
    console.log("DEBUG SAFARI: Відправляю токен:", token ? "ТАК (є рядок)" : "НІ (null)");

    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      // КРИТИЧНО: credentials дозволяє Safari додавати куки до запиту автоматично
      credentials: "include", 
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Помилка 401: Доступ заборонено (токен недійсний)");
      throw new Error(`Помилка сервера: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Оновлення даних користувача
   */
  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
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
   * Видалення відгуку
   */
  deleteReview: async (id: string): Promise<{ message: string }> => {
    const token = getToken();
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
  },

  /**
   * Видалення користувача
   */
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const token = getToken();
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
  }
};
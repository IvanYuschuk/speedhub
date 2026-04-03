import { User } from "@/types/user";

export interface UpdateUserData {
  subscriptionType?: "free" | "premium";
  subscriptionExpires?: string | null;
  role?: "user" | "admin";
}

const BASE_URL = "https://speedhub-6fam.onrender.com/api/admin";

/**
 * Функція для видобутку токена з усіх можливих джерел.
 * Орієнтована на специфіку Safari (ITP та блокування сховищ).
 */
const getToken = () => {
  if (typeof window === "undefined") return null;

  let token = null;

  // 1. Пріоритет №1 (Safari): Пряме розрізання URL-рядка
  // Це працює навіть якщо URLSearchParams заблоковано
  const href = window.location.href;
  if (href.includes("t=")) {
    try {
      const urlPart = href.split("t=")[1];
      token = urlPart.split("&")[0].split("#")[0];
      if (token) {
        // Пробуємо зберегти для наступних запитів, якщо Safari дозволить
        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token);
      }
    } catch (e) {
      console.error("DEBUG: Помилка парсингу токена з URL", e);
    }
  }

  // 2. Пріоритет №2: SessionStorage
  // Іноді Safari дозволяє sessionStorage, коли localStorage під санкціями
  if (!token) {
    token = sessionStorage.getItem("token");
  }

  // 3. Пріоритет №3: Cookies
  if (!token) {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) token = match[2];
  }

  // 4. Пріоритет №4: LocalStorage
  if (!token) {
    token = localStorage.getItem("token");
  }

  return token;
};

export const adminService = {
  /**
   * Отримання списку всіх користувачів
   */
  getAllUsers: async (): Promise<User[]> => {
    const token = getToken();
    
    // КРИТИЧНИЙ ЛОГ: Якщо тут "НІ (null)", значить Safari заблокував доступ до URL
    console.log("DEBUG: Відправляю токен в Safari:", token ? "ТАК (рядок є)" : "НІ (null)");

    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cache-Control": "no-cache" // Забороняємо Safari кешувати помилку 401
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Помилка 401: Доступ заборонено (токен недійсний або відсутній)");
      }
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
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Помилка при видаленні користувача");
    return response.json();
  }
};
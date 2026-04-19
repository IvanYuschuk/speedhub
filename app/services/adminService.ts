import { User } from "@/types/user";

export interface UpdateUserData {
  subscriptionType?: "free" | "premium";
  subscriptionExpires?: string | null;
  role?: "user" | "admin";
}

const BASE_URL = "https://speedhub-6fam.onrender.com/api/admin";

/**
 * Функція витягує токен з куки 'token'.
 * Додано перевірку на "eyJ", щоб не брати сміття на кшталт 'session_active'.
 */
const getJwtFromCookies = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");
  // Шукаємо саме куку з назвою 'token'
  const tokenValue = cookies
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  // Якщо кука є і вона схожа на JWT токен (починається на eyJ)
  if (tokenValue && tokenValue.startsWith("eyJ")) {
    return tokenValue;
  }

  // Якщо в куках немає JWT, спробуємо глянути в localStorage на всякий випадок
  const fallback = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (fallback && fallback.startsWith("eyJ")) {
    return fallback;
  }

  return null;
};

export const adminService = {
  /**
   * Завантаження всіх користувачів
   */
  getAllUsers: async (): Promise<User[]> => {
    const token = getJwtFromCookies();

    // Лог для перевірки: що саме ми дістали
    console.log("🔍 [AdminService] Використовуємо токен:", 
      token ? `${token.substring(0, 15)}...` : "❌ НЕ ЗНАЙДЕНО АБО INVALID");

    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`❌ Помилка ${response.status}: Доступ заборонено або токен недійсний`);
      throw new Error(`Error: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Оновлення користувача
   */
  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const token = getJwtFromCookies();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Update failed");
    return response.json();
  },

  /**
   * Видалення користувача
   */
  deleteUser: async (id: string): Promise<void> => {
    const token = getJwtFromCookies();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Delete failed");
  },
};
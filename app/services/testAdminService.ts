// app/services/testAdminService.ts
const BASE_URL = "https://speedhub-6fam.onrender.com/api/questions";

// Оновлений інтерфейс, що відповідає реальним даним з твого БД/Бекенда
export interface QuestionOption {
  _id?: string;
  id: number;
  text: string;
}

export interface Question {
  _id?: string; // MongoDB ID
  id: string; // Твій кастомний ID (напр. r2q3)
  question: string;
  options: QuestionOption[] | string[]; // Може бути і так, і так (після JSON.parse)
  correct_option_id: number; // Саме так воно в JSON
  category?: string;
  image?: string[]; // Поле в однині, як у JSON
  explanation?: string;
}

export const testAdminService = {
  /**
   * Отримати всі питання
   */
  getAllQuestions: async (token: string | null): Promise<Question[]> => {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    });
    if (!response.ok) throw new Error("Помилка завантаження питань");
    return response.json();
  },

  /**
   * Універсальний метод збереження
   */
  saveQuestion: async (
    formData: FormData,
    token: string | null,
    id?: string,
  ): Promise<Question> => {
    // Якщо ми редагуємо, додаємо id до URL
    const url = id ? `${BASE_URL}/${id}` : BASE_URL;
    const method = id ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type для FormData НЕ СТАВИМО
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Помилка при збереженні питання");
    }

    return response.json();
  },

  /**
   * Видалити питання
   */
  deleteQuestion: async (id: string, token: string | null): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Не вдалося видалити питання");
  },
};

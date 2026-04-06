// app/services/testAdminService.ts
const BASE_URL = "https://speedhub-6fam.onrender.com/api/questions";

export interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctOption: number;
  category: string;
  image?: string;
  explanation?: string;
}

export const testAdminService = {
  // Отримати всі питання
  getAllQuestions: async (token: string | null): Promise<Question[]> => {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Помилка завантаження питань");
    return response.json();
  },

  // Створити нове питання
  createQuestion: async (data: Question, token: string | null) => {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Видалити питання
  deleteQuestion: async (id: string, token: string | null) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

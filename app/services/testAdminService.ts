const BASE_URL = "https://speedhub-6fam.onrender.com/api/questions";

export interface QuestionOption {
  _id?: string;
  id: number;
  text: string;
}

export interface Question {
  _id: string;
  id: string;
  question: string;
  options: QuestionOption[] | string[];
  correct_option_id: number;
  category?: string;
  image?: string[];
  explanation?: string;
}

const getJwtFromCookies = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const tokenValue = cookies
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  if (tokenValue && tokenValue.startsWith("eyJ")) return tokenValue;
  const fallback =
    localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (fallback && fallback.startsWith("eyJ")) return fallback;
  return null;
};

export const testAdminService = {
  getAllQuestions: async (): Promise<Question[]> => {
    const token = getJwtFromCookies();
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

  saveQuestion: async (
    formData: FormData,
    mongoId?: string,
  ): Promise<Question> => {
    const token = getJwtFromCookies();
    const url = mongoId ? `${BASE_URL}/${mongoId}` : BASE_URL;
    const method = mongoId ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Помилка при збереженні питання");
    }

    return response.json();
  },

  deleteQuestion: async (mongoId: string): Promise<void> => {
    const token = getJwtFromCookies();
    const response = await fetch(`${BASE_URL}/${mongoId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Не вдалося видалити питання");
  },
};

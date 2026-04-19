import axios from "axios";

const BASE_URL = "https://speedhub-6fam.onrender.com/api/users";

export interface TestResultData {
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  unitId?: string;
  mistakes: string[];
  resolvedMistakes?: string[];
  isPassed?: boolean;
}

const getValidToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || localStorage.getItem("accessToken");
  }
  return null;
};

export const userService = {
  updateStats: async (
    type: "unit" | "random" | "exam" | "review",
    data: TestResultData,
  ) => {
    try {
      const token = getValidToken();
      const response = await axios.post(
        `${BASE_URL}/update-stats`,
        { type, data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Помилка при оновленні статистики:",
          error.response?.data || error.message,
        );
      }
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const token = getValidToken();
      const response = await axios.get(`${BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },
};

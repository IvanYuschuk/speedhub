export interface UserStatistics {
  unitsPassed: Array<{
    unitId: string;
    correctAnswers: number;
    incorrectAnswers: number;
    totalQuestions: number;
    timeSpent: number;
    isPassed: boolean;
    date: Date;
  }>;
  randomTests: Array<{
    score: number;
    total: number;
    incorrectAnswers: number;
    timeSpent: number;
    date: Date;
  }>;
}

export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: "user" | "admin";
  subscriptionType: "free" | "premium";
  subscriptionExpires: string | null;
  statistics: {
    unitsPassed: Array<{
      unitId: string;
      correctAnswers: number;
      incorrectAnswers: number;
      totalQuestions: number;
      timeSpent: number;
      isPassed: boolean;
      date: string;
    }>;
    randomTests: Array<{
      score: number;
      total: number;
      incorrectAnswers: number;
      timeSpent: number;
      date: string;
    }>;
  };
}

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

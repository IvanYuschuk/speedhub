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

export interface AuthResponse {
  token: string;
  name: string;
  surname?: string;
  role: "user" | "admin";
  subscriptionType: "free" | "premium";
  subscriptionExpires: string | null;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues extends LoginValues {
  name: string;
  surname: string;
}

export interface UnitStat {
  unitId: string;
  correctAnswers: number;
  totalQuestions: number;
  isPassed: boolean;
  date: string;
  mistakes?: string[];
}

export interface RandomTestStat {
  score: number;
  total: number;
  timeSpent: number;
  date: string;
  mistakes?: string[]; 
}

export interface UserStatistics {
  unitsPassed: UnitStat[];
  randomTests: RandomTestStat[];
}
export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: "user" | "admin";
  subscriptionType: "free" | "premium";
  subscriptionExpires: string | null;
  createdAt: string;
  updatedAt: string;
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
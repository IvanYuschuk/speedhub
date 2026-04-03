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

export interface AuthResponse extends User {
  token: string;
}

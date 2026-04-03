import { RegisterData, LoginCredentials } from "@/app/types/auth";
import { User } from "@/types/user";

interface RegisterResponse {
  message: string;
  user?: User;
}

const BASE_URL = "https://speedhub-6fam.onrender.com/api/users";

export const authService = {
  async login(credentials: LoginCredentials): Promise<Partial<User>> {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    return data as Partial<User>;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw result;

    return result as RegisterResponse;
  },
};

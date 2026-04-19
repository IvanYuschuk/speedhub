import { RegisterData, LoginCredentials, User } from "../types/auth";

interface RegisterResponse {
  message: string;
  user?: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<Partial<User>> {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    // ЗБЕРІГАЄМО ТОКЕН ПРАВИЛЬНО
    // Якщо бекенд прислав accessToken або token - кладемо його в пам'ять
    const realToken = data.accessToken || data.token;

    if (realToken && realToken.startsWith("eyJ")) {
      localStorage.setItem("accessToken", realToken);
      localStorage.setItem("role", data.role);
      // ВИДАЛЯЄМО те "session_active", якщо воно там було
      localStorage.removeItem("token");
    }

    return data as Partial<User>;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw result;

    return result as RegisterResponse;
  },
};

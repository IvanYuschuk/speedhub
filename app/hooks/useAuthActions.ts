"use client";

import { useState } from "react";
import { authService } from "@/app/services/authService";
import { AuthResponse, LoginValues, RegisterValues } from "@/types/user";
import { triggerAuthUpdate } from "@/app/utils/auth";

interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
  error?: string;
}

export const useAuthActions = (onClose: () => void) => {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: LoginValues): Promise<void> => {
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = (await authService.login(values)) as any;

      const name = response.name || "Користувач";
      const role = response.role || "user";
      const surname = response.surname || "";
      const subscriptionType = response.subscriptionType || "free";

      // Намагаємось дістати токен. Якщо його немає в JSON,
      // ставимо "session_active", щоб адмінка не блокувала вхід.
      const token = response.token || response.accessToken || "session_active";

      // 1. Записуємо в LocalStorage
      localStorage.setItem("userName", name);
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);

      localStorage.setItem(
        "fullUserData",
        JSON.stringify({
          name,
          surname,
          role,
          subscriptionType,
        }),
      );

      // 2. Записуємо куки (критично для Vercel)
      const expires = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toUTCString();
      document.cookie = `token=${token}; expires=${expires}; path=/; SameSite=Lax;`;
      document.cookie = `accessToken=${token}; expires=${expires}; path=/; SameSite=Lax;`;

      triggerAuthUpdate();

      if (onClose) onClose();

      // 3. Редірект через window.location, щоб скинути стейт і перечитати куки
      window.location.href = role === "admin" ? "/admin" : "/tests";
    } catch (err: unknown) {
      const errorParsed = err as AuthError;
      setError(
        errorParsed.response?.data?.message ||
          errorParsed.message ||
          "Невірний логін або пароль",
      );
    }
  };

  const handleRegister = async (values: RegisterValues): Promise<void> => {
    setError(null);
    try {
      await authService.register(values);
      alert("Успішно! Тепер увійдіть.");
      if (onClose) onClose();
    } catch (err: unknown) {
      const errorParsed = err as AuthError;
      setError(errorParsed.response?.data?.message || "Помилка реєстрації");
    }
  };

  return { handleLogin, handleRegister, error };
};

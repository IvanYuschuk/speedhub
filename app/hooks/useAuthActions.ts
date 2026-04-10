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
      const response = (await authService.login(
        values,
      )) as unknown as AuthResponse;

      const name = response.name || "Користувач";
      const role = response.role || "user";
      const surname = response.surname || "";
      const subscriptionType = response.subscriptionType || "free";

      // 1. Записуємо дані в LocalStorage
      localStorage.setItem("userName", name);
      localStorage.setItem("role", role);
      localStorage.setItem(
        "fullUserData",
        JSON.stringify({
          name,
          surname,
          role,
          subscriptionType,
        }),
      );

      // 2. ПРИМУСОВИЙ ЗАПИС КУК ДЛЯ VERCEL
      // Оскільки сервер на Render не може прокинути куку на домен Vercel автоматично,
      // ми ставимо її вручну. Це дозволить Middleware побачити авторизацію.
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      
      // Ми використовуємо "true" або будь-яке значення, якщо токена немає в JSON,
      // але зазвичай краще, щоб бекенд його присилав. 
      // Якщо в response таки з'явиться поле token, заміни 'authorized' на response.token
      document.cookie = `token=authorized; expires=${expires}; path=/; SameSite=Lax;`;
      document.cookie = `accessToken=authorized; expires=${expires}; path=/; SameSite=Lax;`;

      triggerAuthUpdate();

      if (onClose) onClose();

      // 3. Редірект. Тепер Middleware на Vercel прочитає наші куки
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
      setError(
        errorParsed.response?.data?.message ||
          errorParsed.message ||
          "Помилка реєстрації",
      );
    }
  };

  return { handleLogin, handleRegister, error };
};
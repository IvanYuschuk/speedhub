"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/authService";
import { AuthResponse, LoginValues, RegisterValues } from "@/types/user";
import { triggerAuthUpdate } from "@/app/utils/auth";

interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export const useAuthActions = (onClose: () => void) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: LoginValues): Promise<void> => {
    setError(null);
    try {
      const userData = (await authService.login(values)) as AuthResponse;

      if (userData && userData.token) {
        localStorage.clear();
        sessionStorage.clear();

        const token = userData.token;
        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token);

        localStorage.setItem("userName", userData.name || "Користувач");
        localStorage.setItem(
          "fullUserData",
          JSON.stringify({
            name: userData.name,
            surname: userData.surname,
            role: userData.role,
            subscriptionType: userData.subscriptionType,
            subscriptionExpires: userData.subscriptionExpires,
          }),
        );

        const date = new Date();
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        document.cookie = `token=${token}; expires=${date.toUTCString()}; path=/; SameSite=Lax;`;

        triggerAuthUpdate();

        if (onClose) onClose();

        if (userData.role === "admin") {
          window.location.href = `/admin?t=${token}`;
        } else {
          router.push("/tests");
        }
      }
    } catch (err: unknown) {
      const errorParsed = err as AuthError;
      console.error("Login error:", errorParsed);
      const msg =
        errorParsed.response?.data?.message ||
        errorParsed.message ||
        "Невірний логін або пароль";
      setError(msg);
    }
  };

  const handleRegister = async (values: RegisterValues): Promise<void> => {
    setError(null);
    try {
      await authService.register(values);
      alert("Успішно! Тепер увійдіть у свій акаунт.");
      if (onClose) onClose();
    } catch (err: unknown) {
      const errorParsed = err as AuthError;
      const msg =
        errorParsed.response?.data?.message ||
        errorParsed.message ||
        "Помилка реєстрації";
      setError(msg);
    }
  };

  return { handleLogin, handleRegister, error };
};

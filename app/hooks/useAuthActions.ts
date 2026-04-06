"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/authService";
import { LoginCredentials, RegisterData } from "@/app/types/auth";
import { triggerAuthUpdate } from "@/app/utils/auth";

interface AuthError {
  error?: string;
  message?: string;
}

export const useAuthActions = (onClose: () => void) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: LoginCredentials) => {
    setError(null);
    try {
      const userData = await authService.login(values);

      localStorage.setItem("userName", userData.name || "Користувач");

      triggerAuthUpdate();

      onClose();

      router.push("/tests");
    } catch (err: unknown) {
      const errorData = err as AuthError;
      const msg =
        errorData?.error || errorData?.message || "Невірний логін або пароль";
      setError(msg);
      throw err;
    }
  };

  const handleRegister = async (values: RegisterData) => {
    setError(null);
    try {
      await authService.register(values);
      alert("Успішно! Тепер увійдіть.");
      onClose();
    } catch (err: unknown) {
      const errorData = err as AuthError;
      const msg =
        errorData?.error || errorData?.message || "Помилка реєстрації";
      setError(msg);
      throw err;
    }
  };

  return { handleLogin, handleRegister, error };
};

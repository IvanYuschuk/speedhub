"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/authService";
import { triggerAuthUpdate } from "@/app/utils/auth";

export const useAuthActions = (onClose: () => void) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: any) => {
    setError(null);
    try {
      const userData = (await authService.login(values)) as any;

      if (userData && userData.token) {
        // 1. Очищення старих даних
        localStorage.clear();
        sessionStorage.clear();
        
        // 2. Спроба запису в усі можливі сховища
        const token = userData.token;
        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token); // SessionStorage часто стабільніший у Safari
        
        localStorage.setItem("userName", userData.name || "Користувач");
        localStorage.setItem("fullUserData", JSON.stringify({
          name: userData.name,
          surname: userData.surname,
          role: userData.role,
          subscriptionType: userData.subscriptionType,
          subscriptionExpires: userData.subscriptionExpires,
        }));

        // 3. Запис Cookies (для крос-доменних запитів)
        const date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        document.cookie = `token=${token}; expires=${date.toUTCString()}; path=/; SameSite=Lax;`;

        triggerAuthUpdate();
        
        // Закриваємо модалку перед переходом
        if (onClose) onClose();

        // 4. РЕЖИМ ПЕРЕМОГИ НАД SAFARI
        if (userData.role === "admin") {
          console.log("DEBUG: Жорсткий редірект для Safari...");
          // window.location.href надійніший за router.push, бо він не "губить" query-параметри
          window.location.href = `/admin?t=${token}`;
        } else {
          router.push("/tests");
        }
      }
    } catch (err: any) {
      console.error("Помилка при вході:", err);
      const msg = err.response?.data?.message || err.message || "Невірний логін або пароль";
      setError(msg);
    }
  };

  const handleRegister = async (values: any) => {
    setError(null);
    try {
      await authService.register(values);
      alert("Успішно! Тепер увійдіть у свій акаунт.");
      if (onClose) onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Помилка реєстрації";
      setError(msg);
    }
  };

  return { handleLogin, handleRegister, error };
};
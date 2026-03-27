"use client";
import React, { useEffect, useState } from "react";
import { logout } from "@/app/utils/auth";
import css from "./UserAccount.module.css";

interface UserData {
  name: string;
  surname?: string;
  subscriptionType: "free" | "premium";
  premiumUntil?: string;
}

export default function UserAccount({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Перевіряємо, чи ми на клієнті
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("fullUserData");
      if (data) {
        try {
          const parsedData = JSON.parse(data) as UserData;
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(parsedData);
        } catch (e) {
          console.error("Помилка парсингу даних користувача", e);
        }
      } else {
        // Якщо даних немає, спробуємо хоча б ім'я взяти з простого ключа
        const simpleName = localStorage.getItem("userName");
        if (simpleName) {
          setUser({ name: simpleName, subscriptionType: "free" });
        }
      }
    }
  }, []);

  // Якщо даних зовсім немає, покажемо хоча б порожню картку або статус завантаження
  // щоб компонент не повертав null і не зникав з DOM
  const displayName = user?.name || "Користувач";
  const displaySurname = user?.surname || "";

  return (
    <div className={css.dropdown} onClick={(e) => e.stopPropagation()}>
      <p className={css.name}>
        {displayName} {displaySurname}
      </p>
      <p className={css.role}>Студент SpeedHub</p>

      <div className={css.divider} />

      <div className={css.infoGroup}>
        <div className={css.infoRow}>
          <span className={css.label}>Тариф:</span>
          <span
            className={
              user?.subscriptionType === "premium" ? css.premium : css.base
            }
          >
            {user?.subscriptionType === "premium" ? "Преміум ✨" : "Базовий"}
          </span>
        </div>

        {user?.subscriptionType === "premium" && user?.premiumUntil && (
          <div className={css.infoRow}>
            <span className={css.label}>Діє до:</span>
            <span className={css.date}>
              {new Date(user.premiumUntil).toLocaleDateString("uk-UA")}
            </span>
          </div>
        )}
      </div>

      <div className={css.divider} />

      <button
        type="button"
        onClick={() => {
          logout();
          onClose();
        }}
        className={css.logoutBtn}
      >
        Вийти
      </button>
    </div>
  );
}

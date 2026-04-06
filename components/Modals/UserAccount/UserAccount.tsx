"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/app/utils/auth";
import css from "./UserAccount.module.css";
import { User } from "@/types/user";

export default function UserAccount({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("fullUserData");
      if (data) {
        try {
          const parsedData = JSON.parse(data) as User;
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(parsedData);
        } catch (e) {
          console.error("Помилка парсингу даних користувача", e);
        }
      }
    }
  }, []);

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const displayName = user.name || "Користувач";
  const displaySurname = user.surname || "";

  return (
    <div className={css.dropdown} onClick={(e) => e.stopPropagation()}>
      <div className={css.userHeader}>
        <p className={css.name}>
          {displayName} {displaySurname}
        </p>
        <p className={css.role}>
          {isAdmin ? "Адміністратор SpeedHub" : "Студент SpeedHub"}
        </p>
      </div>

      <div className={css.divider} />

      {!isAdmin && (
        <div className={css.infoGroup}>
          <div className={css.infoRow}>
            <span className={css.label}>Тариф:</span>
            <span
              className={
                user.subscriptionType === "premium" ? css.premium : css.base
              }
            >
              {user.subscriptionType === "premium" ? "Преміум ✨" : "Базовий"}
            </span>
          </div>

          <div className={css.divider} />

          {user.subscriptionType === "premium" && user.subscriptionExpires && (
            <div className={css.infoRow}>
              <span className={css.label}>Діє до:</span>
              <span className={css.date}>
                {new Date(user.subscriptionExpires).toLocaleDateString("uk-UA")}
              </span>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <Link href="/admin" className={css.adminPanelBtn} onClick={onClose}>
          ⚙️ Панель керування
        </Link>
      )}

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

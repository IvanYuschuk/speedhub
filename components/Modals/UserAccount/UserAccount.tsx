"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/app/utils/auth";
import css from "./UserAccount.module.css";
import { User } from "@/types/user";

export default function UserAccount({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<Partial<User> | null>(null);

  useEffect(() => {
    const loadData = () => {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("fullUserData");
        if (data) {
          try {
            setUser(JSON.parse(data));
          } catch (e) {
            console.error("Помилка парсингу даних користувача", e);
          }
        } else {
          const name = localStorage.getItem("userName");
          const role = localStorage.getItem("role") as "user" | "admin";
          if (name) setUser({ name, role: role || "user" });
        }
      }
    };

    loadData();
    window.addEventListener("auth-change", loadData);
    return () => window.removeEventListener("auth-change", loadData);
  }, []);

  if (!user) return null;

  const isAdmin =
    user.role === "admin" || localStorage.getItem("role") === "admin";
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

      {isAdmin && (
        <>
          <Link href="/admin" className={css.adminPanelBtn} onClick={onClose}>
            ⚙️ Панель керування
          </Link>
          <div className={css.divider} />
        </>
      )}

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

          {user.subscriptionType === "premium" && user.subscriptionExpires && (
            <div className={css.infoRow}>
              <span className={css.label}>Діє до:</span>
              <span className={css.date}>
                {new Date(user.subscriptionExpires).toLocaleDateString("uk-UA")}
              </span>
            </div>
          )}
          <div className={css.divider} />
        </div>
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

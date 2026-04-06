"use client";

import React from "react";
import { User } from "@/types/user";
import css from "./UserStatsModal.module.css";

interface UserStatsModalProps {
  user: User | null;
  onClose: () => void;
}

export default function UserStatsModal({ user, onClose }: UserStatsModalProps) {
  if (!user) return null;

  const isPremium = user.subscriptionType === "premium";
  const isAdmin = user.role === "admin";

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <div className={css.header}>
          <div>
            <h2>Деталі користувача</h2>
            {isPremium && !isAdmin && user.subscriptionExpires && (
              <span className={css.premiumBadge}>
                Premium діє до{" "}
                {new Date(user.subscriptionExpires).toLocaleDateString("uk-UA")}
              </span>
            )}
          </div>
          <button className={css.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={css.content}>
          <section className={css.section}>
            <h3>Профіль</h3>
            <p>
              ID: <span>{user._id}</span>
            </p>
            <p>
              Ім'я:{" "}
              <span>
                {user.name} {user.surname}
              </span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
            <p>
              Роль:{" "}
              <span className={isAdmin ? css.adminText : ""}>
                {user.role.toUpperCase()}
              </span>
            </p>
          </section>

          {!isAdmin && (
            <section className={css.section}>
              <h3>Статистика тестів</h3>
              {/* {user.statistics?.unitsPassed &&
              user.statistics.unitsPassed.length > 0 ? (
                <div className={css.statsGrid}>
                  {user.statistics.unitsPassed.map((unit, index) => (
                    <div key={index} className={css.statItem}>
                      <p>
                        Юніт: <span>{unit.unitId}</span>
                      </p>
                      <p>
                        Результат:{" "}
                        <span>
                          {unit.correctAnswers}/{unit.totalQuestions}
                        </span>
                      </p>
                      <p>
                        Статус:{" "}
                        <span>
                          {unit.isPassed ? "✅ Пройдено" : "❌ Провалено"}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={css.noData}>Користувач ще не проходив тестів</p>
              )} */}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

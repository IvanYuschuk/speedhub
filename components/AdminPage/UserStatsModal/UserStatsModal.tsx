"use client";

import React, { useEffect } from "react";
import { User } from "@/types/user";
import css from "./UserStatsModal.module.css";

interface UserStatsModalProps {
  user: User | null;
  onClose: () => void;
}

export default function UserStatsModal({ user, onClose }: UserStatsModalProps) {
  useEffect(() => {
    if (user) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, [user]);

  if (!user) return null;

  const isPremium = user.subscriptionType === "premium";
  const isAdmin = user.role === "admin";
  const units = user.statistics?.unitsPassed || [];
  const randoms = user.statistics?.randomTests || [];

  const exams = randoms.filter((test) => test.total === 20);
  const hasData = units.length > 0 || randoms.length > 0;

  const formatTime = (seconds: number) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
            <h4 className={css.subTitle}>Профіль</h4>
            <p>
              ID: <span>{user._id}</span>
            </p>
            <p>
              {"Прізвище та ім'я: "}{" "}
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
              {hasData ? (
                <div className={css.statsScrollArea}>
                  {/* СЕКЦІЯ ІСПИТІВ */}
                  {exams.length > 0 && (
                    <div className={css.subSection}>
                      <h4 className={css.subTitle}>Іспити</h4>
                      <div className={css.statsList}>
                        {exams.map((test, index) => {
                          const isPassed =
                            test.score > 17 && test.incorrectAnswers <= 2;
                          return (
                            <div key={`exam-${index}`} className={css.statItem}>
                              <p>
                                Результат:{" "}
                                <span
                                  className={
                                    isPassed ? css.textSuccess : css.textDanger
                                  }
                                >
                                  {test.score}/{test.total}
                                </span>
                              </p>
                              <p>
                                Витрачений час: <span>{formatTime(test.timeSpent)}</span>
                              </p>
                              <p>
                                Статус:{" "}
                                <span
                                  className={
                                    isPassed ? css.textSuccess : css.textDanger
                                  }
                                >
                                  {isPassed ? "СКЛАДЕНО" : "НЕ СКЛАДЕНО"}
                                </span>
                              </p>
                              <p>
                                Дата:{" "}
                                <span>
                                  {new Date(test.date).toLocaleDateString(
                                    "uk-UA",
                                  )}
                                </span>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* СЕКЦІЯ ТЕСТІВ ЗА РОЗДІЛАМИ */}
                  {units.length > 0 && (
                    <div className={css.subSection}>
                      <h4 className={css.subTitle}>Тести за розділами</h4>
                      <div className={css.statsList}>
                        {units.map((unit, index) => (
                          <div key={`unit-${index}`} className={css.statItem}>
                            <p>
                              Розділ: <span>{unit.unitId.toUpperCase()}</span>
                            </p>
                            <p>
                              Результат:{" "}
                              <span
                                className={
                                  unit.isPassed
                                    ? css.textSuccess
                                    : css.textDanger
                                }
                              >
                                {unit.correctAnswers}/{unit.totalQuestions}
                              </span>
                            </p>
                            <p>
                              Дата:{" "}
                              <span>
                                {new Date(unit.date).toLocaleDateString(
                                  "uk-UA",
                                )}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className={css.noData}>Користувач ще не проходив тестів</p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

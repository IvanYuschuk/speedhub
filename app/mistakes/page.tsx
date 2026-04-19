"use client";

import React, { useState, useEffect } from "react";
import StatsSummary from "@/components/MistakesPage/StatsSummary/StatsSummary";
import StatsList from "@/components/MistakesPage/StatsList/StatsList";
import TopicMistakes from "@/components/MistakesPage/TopicMistakes/TopicMistakes";
import { userService } from "@/app/services/userService";
import { User } from "@/types/user";
import css from "./Mistakes.module.css";
import Loading from "../loading";
import Link from "next/link";

const Mistakes = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserProfile();
        setUser(data);
      } catch (err) {
        console.error("Помилка при завантаженні статистики:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <Loading />;

  if (!user) {
    return (
      <div className={css.noAuth}>
        Будь ласка, авторизуйтесь, щоб побачити статистику
      </div>
    );
  }

  const isPremium = user.subscriptionType === "premium";

  return (
    <main className={css.main}>
      <div className={css.container}>
        <header className={css.header}>
          <h1 className={css.title}>Моя статистика</h1>
          <p className={css.subtitle}>Аналіз ваших результатів та прогресу</p>
        </header>

        {user.statistics && (
          <>
            <StatsSummary statistics={user.statistics} />

            <div className={css.relativeContainer}>
              <div className={!isPremium ? css.blurredContent : ""}>
                <TopicMistakes statistics={user.statistics} />
                <div className={css.listsStack}>
                  <StatsList
                    title="Історія іспитів"
                    data={
                      user.statistics.randomTests?.filter(
                        (t) => t.total === 20,
                      ) || []
                    }
                    type="exam"
                  />
                </div>
              </div>

              {!isPremium && (
                <div className={css.premiumOverlay}>
                  <div className={css.premiumContent}>
                    <span className={css.lockIcon}>🔒</span>
                    <h3 className={css.premiumTitle}>Premium доступ</h3>
                    <p className={css.premiumText}>
                      Відпрацювання помилок, історія іспитів та статистика за
                      розділами доступні лише з Premium підпискою.
                    </p>
                    <Link href="/premium" className={css.premiumBtn}>
                      Отримати Premium
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {isPremium && (
              <div className={css.freeSection}>
                <StatsList
                  title="Тести за розділами"
                  data={user.statistics.unitsPassed || []}
                  type="unit"
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Mistakes;

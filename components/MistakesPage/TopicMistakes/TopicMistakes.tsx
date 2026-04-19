"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { testsData } from "@/types/tests";
import { UserStatistics } from "@/types/user";
import css from "./TopicMistakes.module.css";

interface TopicMistakesProps {
  statistics: UserStatistics;
}

const TopicMistakes = ({ statistics }: TopicMistakesProps) => {
  const router = useRouter();

  const mistakesByTheme: Record<string, Set<string>> = {};
  const allMistakesIds = new Set<string>();

  statistics.unitsPassed?.forEach((unit) => {
    const m = unit.mistakes || [];
    if (m.length > 0) {
      if (!mistakesByTheme[unit.unitId]) {
        mistakesByTheme[unit.unitId] = new Set();
      }
      m.forEach((id) => {
        mistakesByTheme[unit.unitId].add(id);
        allMistakesIds.add(id);
      });
    }
  });

  statistics.randomTests?.forEach((test) => {
    const m = test.mistakes || [];
    if (m.length > 0) {
      m.forEach((questionId) => {
        allMistakesIds.add(questionId);
        const themeId = questionId.split("q")[0].replace("r", "");
        if (themeId) {
          if (!mistakesByTheme[themeId]) {
            mistakesByTheme[themeId] = new Set();
          }
          mistakesByTheme[themeId].add(questionId);
        }
      });
    }
  });

  const themesWithMistakes = testsData.filter(
    (theme) => mistakesByTheme[theme.id] && mistakesByTheme[theme.id].size > 0,
  );

  if (allMistakesIds.size === 0) return null;

  const handleStartReview = (ids: string[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("review_mistake_ids", JSON.stringify(ids));
      router.push("/mistakes/review");
    }
  };

  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>Відпрацювання помилок</h2>
      <div className={css.grid}>
        {/* Картка "Всі помилки" */}
        <div
          className={`${css.themeCard} ${css.allMistakesCard}`}
          onClick={() => handleStartReview(Array.from(allMistakesIds))}
        >
          <div className={css.themeInfo}>
            <span className={css.themeNumber}>★</span>
            <p className={css.themeTitle}>Всі помилки</p>
          </div>
          <div className={css.counter}>
            <span className={css.allCount}>{allMistakesIds.size}</span>
            <span className={css.label}>питань</span>
          </div>
        </div>

        {/* Картки окремих тем */}
        {themesWithMistakes.map((theme) => (
          <div
            key={theme.id}
            className={css.themeCard}
            onClick={() =>
              handleStartReview(Array.from(mistakesByTheme[theme.id]))
            }
          >
            <div className={css.themeInfo}>
              <span className={css.themeNumber}>{theme.themeNumber}</span>
              <p className={css.themeTitle}>{theme.title}</p>
            </div>
            <div className={css.counter}>
              <span className={css.count}>
                {mistakesByTheme[theme.id].size}
              </span>
              <span className={css.label}>питань</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicMistakes;

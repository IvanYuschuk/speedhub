"use client";

import React from "react";
import { UserStatistics } from "@/types/user";
import css from "./StatsSummary.module.css";

interface StatsSummaryProps {
  statistics: UserStatistics;
}

const StatsSummary = ({ statistics }: StatsSummaryProps) => {
  const TOTAL_QUESTIONS = 1762;

  const unitCorrect =
    statistics.unitsPassed?.reduce((acc, u) => {
      const total = u.totalQuestions || 0;
      const mistakes = u.mistakes?.length || 0;
      return acc + (total - mistakes);
    }, 0) || 0;

  const examCorrect =
    statistics.randomTests?.reduce((acc, t) => {
      // Використовуємо t.score, бо correctAnswers у цьому типі немає
      return acc + (t.score || 0);
    }, 0) || 0;

  const totalCorrect = unitCorrect + examCorrect;
  const progressPercentage = Math.min(
    Math.round((totalCorrect / TOTAL_QUESTIONS) * 100),
    100,
  );
  const passedUnitsCount =
    statistics.unitsPassed?.filter((u) => u.isPassed).length || 0;

  return (
    <div className={css.wrapper}>
      <div className={css.mainCard}>
        <div className={css.progressInfo}>
          <div className={css.textBlock}>
            <p className={css.label}>Загальний прогрес вивчення ПДР</p>
            <h3 className={css.value}>
              {totalCorrect} <span>/ {TOTAL_QUESTIONS} питань</span>
            </h3>
          </div>
          <div className={css.percentage}>{progressPercentage}%</div>
        </div>
        <div className={css.progressBar}>
          <div
            className={css.progressFill}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className={css.grid}>
        <div className={css.miniCard}>
          <p className={css.miniLabel}>Пройдено тем</p>
          <p className={css.miniValue}>
            {passedUnitsCount} <span>з 34</span>
          </p>
        </div>
        <div className={css.miniCard}>
          <p className={css.miniLabel}>Всього спроб</p>
          <p className={css.miniValue}>
            {(statistics.unitsPassed?.length || 0) +
              (statistics.randomTests?.length || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;

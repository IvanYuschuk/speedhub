"use client";

import React from "react";
import css from "./StatsList.module.css";
import { testsData } from "@/types/tests";

interface StatsDataItem {
  date: string;
  score?: number;
  total?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  isPassed?: boolean;
  unitId?: string;
  timeSpent?: number;
  mistakes?: string[];
}

interface StatsListProps {
  title: string;
  data: StatsDataItem[];
  type: "exam" | "unit";
}

const StatsList = ({ title, data, type }: StatsListProps) => {
  const formatTime = (seconds?: number) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const displayData =
    type === "unit"
      ? testsData.map((theme) => ({
          theme,
          passedData: data.find((d) => d.unitId === theme.id),
        }))
      : data.map((item) => ({ theme: null, passedData: item }));

  if (type === "exam" && data.length === 0) return null;

  return (
    <div className={css.wrapper}>
      <h2 className={css.listTitle}>{title}</h2>
      <div className={type === "unit" ? css.themeGrid : css.list}>
        {displayData.map((item, idx) => {
          const { theme, passedData } = item;

          if (type === "unit" && theme) {
            const hasHistory = !!passedData;
            const themeWithCount = theme as unknown as {
              questionsCount?: number;
              themeNumber?: string | number;
            };
            const total = themeWithCount.questionsCount || 20;
            const mistakesCount = passedData?.mistakes?.length || 0;
            const correct = hasHistory
              ? (passedData.totalQuestions || total) - mistakesCount
              : 0;
            const currentTotal = passedData?.totalQuestions || total;
            const isPassed = hasHistory && correct / currentTotal >= 0.9;

            return (
              <div
                key={theme.id}
                className={`${css.themeItem} ${!hasHistory ? css.notStarted : ""}`}
              >
                <div className={css.themeContent}>
                  <div className={css.info}>
                    <span className={css.date}>
                      Розділ {themeWithCount.themeNumber || idx + 1}
                    </span>
                    <span className={css.name}>{theme.title}</span>
                  </div>
                  <div className={css.result}>
                    {hasHistory ? (
                      <div className={css.resultRow}>
                        <span className={isPassed ? css.passed : css.failed}>
                          {correct}/{currentTotal}
                        </span>
                        <span className={css.status}>
                          {isPassed ? "Складено" : "Не складено"}
                        </span>
                      </div>
                    ) : (
                      <span className={css.status}>Не розпочато</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          if (passedData) {
            const isPassed = (passedData.score || 0) > 17;
            return (
              <div key={idx} className={css.item}>
                <div className={css.mainInfo}>
                  <div className={css.info}>
                    <span className={css.date}>
                      ІСПИТ ВІД{" "}
                      {new Date(passedData.date).toLocaleDateString("uk-UA")}
                    </span>
                    <span className={css.name}>Екзаменаційний тест</span>
                  </div>
                  <div className={css.examMeta}>
                    <div className={css.resultWrapper}>
                      <span className={isPassed ? css.passed : css.failed}>
                        {passedData.score}/{passedData.total}
                      </span>
                      <span className={css.status}>
                        {isPassed ? "Складено" : "Не складено"}
                      </span>
                    </div>
                    <div className={css.footerInfo}>
                      <span className={css.timeSpent}>
                        ⏱ {formatTime(passedData.timeSpent)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default StatsList;

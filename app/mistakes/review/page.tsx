"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { userService } from "@/app/services/userService";
import Loading from "@/app/loading";

import QuestionContent from "@/components/TestPage/QuestionContent/QuestionContent";
import QuestionOptions from "@/components/TestPage/QuestionOptions/QuestionOptions";
import MistakesTestResults from "@/components/MistakesPage/MistakesTestResults/MistakesTestResults";
import TestProgress from "@/components/TestPage/TestProgress/TestProgress";

import examCss from "../../tests/exam/ExamPage.module.css";
import localCss from "./ReviewPage.module.css";

const ReviewPage = () => {
  const [mistakeIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("review_mistake_ids");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>(
    {},
  );
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["reviewQuestions", mistakeIds],
    queryFn: async () => {
      const res = await axios.post(
        "https://speedhub-6fam.onrender.com/api/questions/get-by-ids",
        { ids: mistakeIds },
      );
      return res.data;
    },
    enabled: mistakeIds.length > 0,
  });

  useEffect(() => {
    if (isFinished && !isSaved && questions) {
      // Визначаємо unitId (якщо всі помилки з однієї теми, беремо її ID)
      const unitId = questions[0]?.unitId;

      userService
        .updateStats("review", {
          unitId: unitId, // Додаємо unitId, щоб бекенд знав, яку тему оновлювати
          correctAnswers: correctCount,
          incorrectAnswers: questions.length - correctCount,
          totalQuestions: questions.length,
          timeSpent: 0,
          mistakes: [],
          resolvedMistakes: resolvedIds,
          isPassed: correctCount / questions.length >= 0.9, // Рахуємо чи здано
        })
        .then(() => setIsSaved(true));
    }
  }, [isFinished, isSaved, questions, correctCount, resolvedIds]);

  if (isLoading) return <Loading />;

  const currentQuestion = questions ? questions[currentIndex] : null;
  const isCurrentChecked = currentQuestion
    ? checkedAnswers[currentQuestion.id]
    : false;

  const handleCheck = () => {
    if (!currentQuestion) return;
    setCheckedAnswers((prev) => ({ ...prev, [currentQuestion.id]: true }));
    if (
      selectedAnswers[currentQuestion.id] === currentQuestion.correct_option_id
    ) {
      setCorrectCount((prev) => prev + 1);
      setResolvedIds((prev) => [...prev, currentQuestion.id]);
    }
  };

  const handleNext = () => {
    if (currentIndex < (questions?.length || 0) - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <section className={examCss.section}>
        <div className={examCss.container}>
          <MistakesTestResults
            correctAnswersCount={correctCount}
            totalQuestions={questions?.length || 0}
            onRetry={() => window.location.reload()}
          />
        </div>
      </section>
    );
  }

  return (
    <section className={examCss.section}>
      <div className={examCss.container}>
        <div className={examCss.testWrapper}>
          <TestProgress
            currentIndex={currentIndex}
            totalQuestions={questions?.length || 0}
          />

          {currentQuestion && (
            <>
              <QuestionContent question={currentQuestion} />
              <QuestionOptions
                question={currentQuestion}
                selectedAnswerId={selectedAnswers[currentQuestion.id]}
                isCurrentChecked={isCurrentChecked}
                onOptionSelect={(id) =>
                  !isCurrentChecked &&
                  setSelectedAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: id,
                  }))
                }
              />

              <div className={localCss.buttonContainer}>
                {!isCurrentChecked ? (
                  <button
                    onClick={handleCheck}
                    disabled={!selectedAnswers[currentQuestion.id]}
                    className={`${localCss.actionButton} ${localCss.checkBtn}`}
                  >
                    Перевірити
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className={`${localCss.actionButton} ${localCss.nextBtn}`}
                  >
                    {currentIndex === (questions?.length || 0) - 1
                      ? "Завершити"
                      : "Наступне →"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewPage;

"use client";

import React, { useState, useEffect } from "react";
import css from "./TestPage.module.css";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getTestsByTheme } from "@/lib/api";
import { userService } from "@/app/services/userService";
import TestResults from "@/components/TestPage/TestResults/TestResults";
import QuestionStepper from "@/components/TestPage/QuestionStepper/QuestionStepper";
import TestProgress from "@/components/TestPage/TestProgress/TestProgress";
import QuestionContent from "@/components/TestPage/QuestionContent/QuestionContent";
import { Test } from "@/types/tests";
import QuestionOptions from "@/components/TestPage/QuestionOptions/QuestionOptions";
import TestControls from "@/components/TestPage/TestControls/TestControls";
import Loading from "@/app/loading";

const fallbackQuestion: Test = {
  _id: "q1",
  id: "r1q4",
  image: [],
  question: "Чи належить до проїзної частини велосипедна смуга?",
  options: [
    { _id: "o1", id: 1, text: "Так, належить." },
    { _id: "o2", id: 2, text: "Ні, не належить." },
  ],
  correct_option_id: 1,
  explanation:
    "Велосипедна смуга виконується в межах проїзної частини, тому вона до неї належить.",
};

const TestPageClient = () => {
  const { id } = useParams<{ id: string }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [isFinished, setIsFinished] = useState(false);
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>(
    {},
  );
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const { data: tests, isLoading } = useQuery({
    queryKey: ["testByTheme", id],
    queryFn: () => getTestsByTheme(id),
    refetchOnMount: false,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  useEffect(() => {
    if (isFinished && !isSaved && tests) {
      const correctCount = tests.reduce(
        (acc, q) =>
          selectedAnswers[q.id] === q.correct_option_id ? acc + 1 : acc,
        0,
      );

      userService
        .updateStats("unit", {
          unitId: id,
          correctAnswers: correctCount,
          incorrectAnswers: (tests?.length || 0) - correctCount,
          totalQuestions: tests?.length || 0,
          timeSpent: 0,
          mistakes: mistakeIds,
          isPassed: correctCount / (tests?.length || 1) >= 0.9,
        })
        .then(() => setIsSaved(true))
        .catch((err) => console.error("Error saving theme stats:", err));
    }
  }, [isFinished, isSaved, tests, selectedAnswers, mistakeIds, id]);

  if (isLoading) {
    return <Loading />;
  }

  const currentQuestion = tests ? tests[currentIndex] : fallbackQuestion;
  const totalQuestions = tests?.length || 0;
  const isCurrentChecked = checkedAnswers[currentQuestion.id];

  const handleOptionSelect = (optionId: number) => {
    if (isCurrentChecked) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleCheckAnswer = () => {
    setCheckedAnswers((prev) => ({ ...prev, [currentQuestion.id]: true }));

    if (
      selectedAnswers[currentQuestion.id] !== currentQuestion.correct_option_id
    ) {
      setMistakeIds((prev) => [...new Set([...prev, currentQuestion.id])]);
    }
  };

  const handleNext = () =>
    currentIndex < totalQuestions - 1 && setCurrentIndex((prev) => prev + 1);
  const handlePrev = () =>
    currentIndex > 0 && setCurrentIndex((prev) => prev - 1);
  const handleFinish = () => setIsFinished(true);

  const handleRetry = () => {
    setIsFinished(false);
    setIsSaved(false);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setCheckedAnswers({});
    setMistakeIds([]);
  };

  if (isFinished) {
    const correctAnswersCount = tests?.reduce((acc, question) => {
      return selectedAnswers[question.id] === question.correct_option_id
        ? acc + 1
        : acc;
    }, 0);

    return (
      <section className={css.section}>
        <div className={css.container}>
          <TestResults
            correctAnswersCount={correctAnswersCount}
            totalQuestions={totalQuestions}
            onRetry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.testWrapper}>
          <QuestionStepper
            questions={tests || []}
            currentIndex={currentIndex}
            checkedAnswers={checkedAnswers}
            selectedAnswers={selectedAnswers}
            onStepClick={setCurrentIndex}
          />
          <TestProgress
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
          />
          <QuestionContent question={currentQuestion} />
          <QuestionOptions
            question={currentQuestion}
            selectedAnswerId={selectedAnswers[currentQuestion.id]}
            isCurrentChecked={isCurrentChecked}
            onOptionSelect={handleOptionSelect}
          />
          <TestControls
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            isCurrentChecked={isCurrentChecked}
            hasSelectedAnswer={!!selectedAnswers[currentQuestion.id]}
            onPrev={handlePrev}
            onNext={handleNext}
            onCheck={handleCheckAnswer}
            onFinish={handleFinish}
          />
        </div>
      </div>
    </section>
  );
};

export default TestPageClient;

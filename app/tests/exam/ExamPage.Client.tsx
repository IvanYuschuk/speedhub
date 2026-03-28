'use client';

import React, { useState, useEffect} from 'react';
import css from './ExamPage.module.css';
import { useQuery } from '@tanstack/react-query';
import { getExamTest } from '@/lib/api';
import TestResults from '@/components/TestPage/TestResults/TestResults';
import QuestionStepper from '@/components/TestPage/QuestionStepper/QuestionStepper';
import TestProgress from '@/components/TestPage/TestProgress/TestProgress';
import QuestionContent from '@/components/TestPage/QuestionContent/QuestionContent';
import { Test } from '@/types/tests';
import QuestionOptions from '@/components/TestPage/QuestionOptions/QuestionOptions';
import TestControls from '@/components/TestPage/TestControls/TestControls';

const fallbackQuestion: Test = {
    _id: "q1", id: "r1q4", image: [],
    question: "Чи належить до проїзної частини велосипедна смуга?",
    options: [
        { _id: "o1", id: 1, text: "Так, належить." },
        { _id: "o2", id: 2, text: "Ні, не належить." }
    ],
    correct_option_id: 1,
    explanation: "Велосипедна смуга виконується в межах проїзної частини, тому вона до неї належить."
};

const TestPageClient = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});
    //const [timeLeft, setTimeLeft] = useState(20 * 60);

    useEffect(() => {
        window.scrollTo({
            top: 0, 
            behavior: 'smooth' 
        });
    }, [currentIndex]);

    const { data: tests } = useQuery({
        queryKey: ["examTest"],
        queryFn: () => getExamTest(),
        refetchOnMount: false,
    });
    
    const currentQuestion = tests ? tests[currentIndex] : fallbackQuestion;
    const totalQuestions = tests?.length || 0;
    const isCurrentChecked = checkedAnswers[currentQuestion.id];

    const handleOptionSelect = (optionId: number) => {
        if (isCurrentChecked) return;
        setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    };
    const handleCheckAnswer = () => setCheckedAnswers(prev => ({ ...prev, [currentQuestion.id]: true }));
    const handleNext = () => currentIndex < totalQuestions - 1 && setCurrentIndex(prev => prev + 1);
    const handlePrev = () => currentIndex > 0 &&  setCurrentIndex(prev => prev - 1);
    const handleFinish = () => setIsFinished(true);
    const handleRetry = () => {
        setIsFinished(false);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setCheckedAnswers({});
    };
    
/*     useEffect(() => {
        // Якщо тест завершено або час вийшов — зупиняємо таймер
        if (isFinished || timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerId);
                    handleFinish(); // Автоматично завершуємо тест, якщо час вийшов
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // Очищення інтервалу при розмонтуванні компонента
        return () => clearInterval(timerId);
    }, [isFinished, timeLeft]); */
    
/*     const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }; */

    if (isFinished) {
        const correctAnswersCount = tests?.reduce((acc, question) => {
            return selectedAnswers[question.id] === question.correct_option_id ? acc + 1 : acc;
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
                    {/* <div className={`${css.timer} ${timeLeft <= 60 ? css.timerDanger : ''}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={css.timerIcon}>
                             <circle cx="12" cy="12" r="10"></circle>
                             <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {formatTime(timeLeft)}
                    </div> */}
                   
                    <TestProgress
                        currentIndex={currentIndex}
                        totalQuestions={totalQuestions}
                    />
                    <QuestionContent
                        question={currentQuestion}
                    />
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


                           /*  <div className={`${css.timer} ${timeLeft <= 60 ? css.timerDanger : ''}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={css.timerIcon}>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                {formatTime(timeLeft)}
                            </div> */

/*   const [timeLeft, setTimeLeft] = useState(20 * 60); */
                          
/* useEffect(() => {
        // Якщо тест завершено або час вийшов — зупиняємо таймер
        if (isFinished || timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerId);
                    handleFinish(); // Автоматично завершуємо тест, якщо час вийшов
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // Очищення інтервалу при розмонтуванні компонента
        return () => clearInterval(timerId);
    }, [isFinished, timeLeft]); // Залежності хука */

/*         const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }; */
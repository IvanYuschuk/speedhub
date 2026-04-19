'use client';

import React, { useState, useEffect } from 'react';
import css from './ExamPage.module.css';
import { useQuery } from '@tanstack/react-query';
import { getExamTest } from '@/lib/api';
import { userService } from '@/app/services/userService';
import QuestionStepper from '@/components/TestPage/QuestionStepper/QuestionStepper';
import TestProgress from '@/components/TestPage/TestProgress/TestProgress';
import QuestionContent from '@/components/TestPage/QuestionContent/QuestionContent';
import { Test } from '@/types/tests';
import QuestionOptions from '@/components/TestPage/QuestionOptions/QuestionOptions';
import TestControls from '@/components/TestPage/TestControls/TestControls';
import Timer from '@/components/TestPage/Timer/Timer';
import ExamFail from '@/components/TestPage/ExamResults/ExamFail';
import ExamSuccess from '@/components/TestPage/ExamResults/ExamSuccess';

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

const ExamPageClient = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(1200);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentIndex]);

    const { data: tests } = useQuery({
        queryKey: ["examTest"],
        queryFn: () => getExamTest(),
        refetchOnMount: false,
    });
    
    const currentQuestion = tests ? tests[currentIndex] : fallbackQuestion;
    const totalQuestions = tests?.length || 0;
    const isCurrentChecked = checkedAnswers[currentQuestion.id];

    useEffect(() => {
        if (isFinished && !isSaved && tests) {
            const correctCount = tests.reduce((acc, q) => 
                selectedAnswers[q.id] === q.correct_option_id ? acc + 1 : acc, 0
            );

            userService.updateStats('exam', {
                correctAnswers: correctCount,
                incorrectAnswers: wrongAnswerCount,
                totalQuestions: totalQuestions,
                timeSpent: 1200 - timeLeft
            }).then(() => setIsSaved(true)).catch(err => console.error(err));
        }
    }, [isFinished, isSaved, tests, selectedAnswers, wrongAnswerCount, totalQuestions, timeLeft]);

    const handleOptionSelect = (optionId: number) => {
        if (isCurrentChecked) return;
        setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    };

    const handleCheckAnswer = () => {
        setCheckedAnswers(prev => ({ ...prev, [currentQuestion.id]: true }));
        if (selectedAnswers[currentQuestion.id] !== currentQuestion.correct_option_id) {
            const nextWrong = wrongAnswerCount + 1;
            setWrongAnswerCount(nextWrong);
            if (nextWrong >= 3) setIsFinished(true);
        };
    }

    const handleNext = () => currentIndex < totalQuestions - 1 && setCurrentIndex(prev => prev + 1);
    const handlePrev = () => currentIndex > 0 &&  setCurrentIndex(prev => prev - 1);
    const handleFinish = () => setIsFinished(true);
    
    const handleRetry = () => {
        setIsFinished(false);
        setIsSaved(false);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setCheckedAnswers({});
        setWrongAnswerCount(0);
        setTimeLeft(1200);
    };
    
    useEffect(() => {
        if (isFinished || timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerId);
    }, [isFinished, timeLeft]); 

    if (isFinished) {
        const correctCount = tests?.reduce((acc, q) => 
            selectedAnswers[q.id] === q.correct_option_id ? acc + 1 : acc, 0
        ) || 0;

        if (correctCount > 17 && wrongAnswerCount <= 2) {
            return <section className={css.section}><div className={css.container}><ExamSuccess onRetry={handleRetry}/></div></section>;
        } else {
            return <section className={css.section}><div className={css.container}><ExamFail onRetry={handleRetry} mistakesCount={wrongAnswerCount}/></div></section>;
        }
    }

    return (
        <section className={css.section}>
            <div className={css.container}>
                <div className={css.testWrapper}>
                    <QuestionStepper questions={tests || []} currentIndex={currentIndex} checkedAnswers={checkedAnswers} selectedAnswers={selectedAnswers} onStepClick={setCurrentIndex} />
                    <Timer timeLeft={timeLeft}/>
                    <TestProgress currentIndex={currentIndex} totalQuestions={totalQuestions} />
                    <QuestionContent question={currentQuestion} />
                    <QuestionOptions question={currentQuestion} selectedAnswerId={selectedAnswers[currentQuestion.id]} isCurrentChecked={isCurrentChecked} onOptionSelect={handleOptionSelect} />
                    <TestControls currentIndex={currentIndex} totalQuestions={totalQuestions} isCurrentChecked={isCurrentChecked} hasSelectedAnswer={!!selectedAnswers[currentQuestion.id]} onPrev={handlePrev} onNext={handleNext} onCheck={handleCheckAnswer} onFinish={handleFinish} />
                </div>
            </div>
        </section>
    );
};

export default ExamPageClient;
"use client";

import { getExamTest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import css from "./ExamPage.module.css";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const ExamPageClient = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});
    const [timeLeft, setTimeLeft] = useState(20 * 60);

    const { data: tests } = useQuery({
        queryKey: ["tests"],
        queryFn: () => getExamTest(),
        refetchOnMount: false,
    });

    const currentQuestion = tests ? tests[currentIndex] : {
        _id: "q1",
        id: "r1q4",
        image: [],
        question: "Чи належить до проїзної частини велосипедна смуга?",
        options: [
            { _id: "o1", id: 1, text: "Так, належить." },
            { _id: "o2", id: 2, text: "Ні, не належить." }
        ],
        correct_option_id: 1,
        explanation: "Велосипедна смуга виконується в межах проїзної частини, тому вона до неї належить."
    }; 
    const totalQuestions = tests?.length || 0;
    const isCurrentChecked = checkedAnswers[currentQuestion.id];

    
    const handleOptionSelect = (optionId: number) => {
        if (isCurrentChecked) return; // Якщо вже натиснули "Відповісти", змінювати не можна

        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionId
        }));
     };
    const handleCheckAnswer = () => {
        setCheckedAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: true
        }));
     };
    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        }
     };
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
     };
    const handleFinish = () => {
        setIsFinished(true);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const stepperRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        window.scrollTo({
            top: 0, // Скролимо на самий верх
            behavior: 'smooth' // 'smooth' для плавного скролу, 'auto' для миттєвого
        });
    
        if (stepperRef.current) {
            const container = stepperRef.current;
            const activeStep = container.children[currentIndex] as HTMLElement;
    
            if (activeStep) {
                const containerScrollLeft = container.scrollLeft; // Наскільки вже проскролено
                const containerWidth = container.clientWidth; // Ширина видимої частини
    
                // Координати поточної кнопки
                const stepLeft = activeStep.offsetLeft;
                const stepRight = stepLeft + activeStep.offsetWidth;
    
                // Якщо кнопка виходить за ПРАВИЙ край екрана
                if (stepRight > containerScrollLeft + containerWidth) {
                    container.scrollTo({
                        // Скролимо так, щоб кнопка влізла + даємо 24px відступу, щоб було видно краєчок наступної
                        left: stepRight - containerWidth + 24,
                        behavior: 'smooth'
                    });
                }
                // Якщо кнопка сховалася за ЛІВИМ краєм екрана
                else if (stepLeft < containerScrollLeft) {
                    container.scrollTo({
                        // Скролимо назад вліво + 24px відступу
                        left: stepLeft - 24,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }, [currentIndex]);

    useEffect(() => {
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
    }, [isFinished, timeLeft]); // Залежності хука
    
    if (isFinished) {
        // Рахуємо правильні відповіді
        const correctAnswersCount = tests?.reduce((acc, question) => {
            return selectedAnswers[question.id] === question.correct_option_id ? acc + 1 : acc;
        }, 0);

        return (
            <section className={css.section}>
                <div className={css.container}>
                    <div className={css.resultCard}>
                        <h2 className={css.heading}>Тест <span className={css.highlight}>завершено!</span></h2>
                        <p className={css.resultText}>
                            Твій результат: <strong>{correctAnswersCount} з {totalQuestions}</strong> правильних відповідей.
                        </p>
                        <div className={css.resultActions}>
                            <button className={css.buttonOutline} onClick={() => {
                                setIsFinished(false);
                                setCurrentIndex(0);
                                setSelectedAnswers({});
                                setCheckedAnswers({});
                                setTimeLeft(20 * 60);
                            }}>
                                Пройти ще раз
                            </button>
                            <Link href="/tests" className={css.button}>
                                Повернутись до тем
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={css.section}>
            <div className={css.container}>
                <div className={css.testWrapper}>
                    {/* НАВІГАЦІЯ ПО ПИТАННЯХ (Верхня панель) */}
                    <div className={css.questionStepper} ref={stepperRef}>
                        {tests?.map((q, index) => {
                            // Перевіряємо статуси для кожної кнопки
                            const isChecked = checkedAnswers[q.id];
                            const isCorrect = isChecked && selectedAnswers[q.id] === q.correct_option_id;
                            const isIncorrect = isChecked && selectedAnswers[q.id] !== q.correct_option_id;
                            const isActive = index === currentIndex;

                            // Призначаємо правильний CSS-клас
                            let statusClass = '';
                            if (isCorrect) {
                                statusClass = css.stepCorrect;
                            } else if (isIncorrect) {
                                statusClass = css.stepIncorrect;
                            } else if (isActive) {
                                statusClass = css.stepActive;
                            }

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    className={`${css.stepBtn} ${statusClass}`}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Перейти до питання ${index + 1}`}
                                >
                                    {index + 1}
                                    </button>
                            );
                        })}
                    </div>
                    
                    
                    {/* Хедер тесту */}
                    <div className={css.testHeader}>
                        <div className={css.headerTop}>
                            <span className={css.progressText}>
                                Питання {currentIndex + 1} з {totalQuestions}
                            </span>
                            
                            {/* БЛОК ТАЙМЕРА */}
                            <div className={`${css.timer} ${timeLeft <= 60 ? css.timerDanger : ''}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={css.timerIcon}>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>

                    {/* Текст питання */}

                    {currentQuestion.image && currentQuestion.image.length > 0 && (
                        <ul className={css.imageBlock}>
                            {currentQuestion.image.map((link, index) => (
                                <li key={index} className={css.imageItem}>
                                    <Image 
                                        src={link} 
                                        alt={`Ілюстрація до питання ${currentIndex + 1}`} 
                                        width={800} 
                                        height={450} 
                                        className={css.questionImage}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}

                    <h2 className={css.questionTitle}>{currentQuestion.question}</h2>
                    

                   {/* Варіанти відповідей */}
                    <div className={css.optionsList}>
                        {currentQuestion.options.map(option => {
                            const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                            const isCorrect = option.id === currentQuestion.correct_option_id;
                            
                            // Визначаємо класи залежно від статусу перевірки
                            let optionStatusClass = '';
                            if (isCurrentChecked) {
                                if (isCorrect) {
                                    optionStatusClass = css.correct; // Завжди підсвічуємо правильну зеленим
                                } else if (isSelected && !isCorrect) {
                                    optionStatusClass = css.incorrect; // Якщо вибрали неправильну — червоним
                                } else {
                                    optionStatusClass = css.disabled; // Інші робимо напівпрозорими
                                }
                            } else if (isSelected) {
                                optionStatusClass = css.selected; // Звичайна підсвітка (синя) до перевірки
                            }

                            return (
                                <button
                                    key={option._id}
                                    type="button"
                                    className={`${css.optionBtn} ${optionStatusClass}`}
                                    onClick={() => handleOptionSelect(option.id)}
                                >
                                    <span className={css.optionLetter}>
                                        {String.fromCharCode(1040 + currentQuestion.options.indexOf(option))}
                                    </span>
                                    <span className={css.optionText}>{option.text}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Навігація */}
                    <div className={css.navigation}>
                        <button 
                            className={css.navBtn} 
                            onClick={handlePrev} 
                            disabled={currentIndex === 0}
                        >
                            ← Назад
                        </button>

                        {/* ЛОГІКА КНОПОК ЗМІНИЛАСЯ */}
                        {!isCurrentChecked ? (
                            <button 
                                className={css.button} 
                                onClick={handleCheckAnswer}
                                disabled={!selectedAnswers[currentQuestion.id]}
                            >
                                Відповісти
                            </button>
                        ) : currentIndex === totalQuestions - 1 ? (
                            <button 
                                className={css.button} 
                                onClick={handleFinish}
                            >
                                Завершити тест
                            </button>
                        ) : (
                            <button 
                                className={css.button} 
                                onClick={handleNext}
                            >
                                Наступне →
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ExamPageClient;
'use client';

import React, { useState } from 'react';
import css from './TestPage.module.css';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import getTestsByTheme from '@/lib/api';
import Image from 'next/image';





// Мокові дані для прикладу (потім заміниш на дані з API)
/* const mockQuestions: Test[] = [
    {
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
    },
    {
        _id: "q2",
        id: "r1q5",
        image: [],
        question: "Який колір має лінія розмітки, що позначає велосипедну смугу?",
        options: [
            { _id: "o3", id: 1, text: "Жовтий." },
            { _id: "o4", id: 2, text: "Білий." },
            { _id: "o5", id: 3, text: "Червоний." }
        ],
        correct_option_id: 2,
        explanation: "Лінії розмітки, що відокремлюють велосипедну смугу, мають білий колір."
    }
]; */

const TestPageClient = () => {
    // Стан для поточного індексу питання
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Стан для збереження вибраних відповідей (ключ - id питання, значення - id відповіді)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    
    // Стан завершення тесту
    const [isFinished, setIsFinished] = useState(false);

    const {id} = useParams<{id: string}>()
    
    const { data: mockQuestions, isSuccess } = useQuery({
        queryKey: ["test", id],
        queryFn: () => getTestsByTheme(id),
        refetchOnMount: false,
    });
    
    if (isSuccess) {}
    const currentQuestion = mockQuestions ? mockQuestions[currentIndex] : {
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
    const totalQuestions = mockQuestions?.length || 0;

    // Обробник вибору варіанта
    const handleOptionSelect = (optionId: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionId
        }));
    };

    // Наступне питання
    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    // Попереднє питання
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Завершити тест
    const handleFinish = () => {
        setIsFinished(true);
    };

    // Якщо тест завершено — показуємо екран результатів
    if (isFinished) {
        // Рахуємо правильні відповіді
        const correctAnswersCount = mockQuestions?.reduce((acc, question) => {
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
                    
                    {/* Хедер тесту (Прогрес) */}
                    <div className={css.testHeader}>
                        <span className={css.progressText}>
                            Питання {currentIndex + 1} з {totalQuestions}
                        </span>
                        {/* Прогрес-бар */}
                        <div className={css.progressBar}>
                            <div 
                                className={css.progressFill} 
                                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                            ></div>
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
                            return (
                                <button
                                    key={option._id}
                                    type="button"
                                    className={`${css.optionBtn} ${isSelected ? css.selected : ''}`}
                                    onClick={() => handleOptionSelect(option.id)}
                                >
                                    <span className={css.optionLetter}>
                                        {/* Показуємо А, Б, В... замість цифр */}
                                        {String.fromCharCode(1040 + currentQuestion.options.indexOf(option))}
                                    </span>
                                    <span className={css.optionText}>{option.text}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Навігація (Кнопки Назад / Далі) */}
                    <div className={css.navigation}>
                        <button 
                            className={css.navBtn} 
                            onClick={handlePrev} 
                            disabled={currentIndex === 0}
                        >
                            ← Назад
                        </button>

                        {currentIndex === totalQuestions - 1 ? (
                            <button 
                                className={css.button} 
                                onClick={handleFinish}
                                disabled={!selectedAnswers[currentQuestion.id]} // Блокуємо, якщо нічого не обрано
                            >
                                Завершити тест
                            </button>
                        ) : (
                            <button 
                                className={css.button} 
                                onClick={handleNext}
                                disabled={!selectedAnswers[currentQuestion.id]} // Обов'язково вибрати варіант, щоб піти далі
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

export default TestPageClient;
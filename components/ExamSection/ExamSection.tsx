import React from 'react';
import Link from 'next/link';
import css from './ExamSection.module.css';

const ExamSection = () => {
    return (
        <section className={css.section}>
            <div className={css.container}>
                <div className={css.contentCard}>
                    
                    {/* Заголовок */}
                    <h2 className={css.heading}>
                        <span className={css.highlight}>Симуляція</span> іспиту
                    </h2>

                    {/* Список переваг */}
                    <ul className={css.featuresList}>
                        <li className={css.featureItem}>
                            <div className={css.checkIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className={css.featureText}>
                                Повний іспитовий час та кількість питань як на офіційному тесті
                            </span>
                        </li>
                        <li className={css.featureItem}>
                            <div className={css.checkIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className={css.featureText}>
                                Можливість проходити тест кілька разів
                            </span>
                        </li>
                        <li className={css.featureItem}>
                            <div className={css.checkIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className={css.featureText}>
                                Мотивація та оцінка готовності до реального іспиту
                            </span>
                        </li>
                    </ul>

                    {/* Кнопка */}
                    <Link href="/tests/exam" className={css.button}>
                        Пройти тестування
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default ExamSection;
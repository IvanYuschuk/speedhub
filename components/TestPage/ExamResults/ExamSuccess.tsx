import React from 'react';
import Link from 'next/link';
import css from './ExamResults.module.css';

interface ExamSuccessProps {
    onRetry: () => void;
}

const ExamSuccess = ({ onRetry }: ExamSuccessProps) => {
    return (
        <div className={`${css.resultCard} ${css.successCard}`}>
            
            {/* Іконка успіху (Галочка) */}
            <div className={`${css.iconWrapper} ${css.iconSuccess}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>

            <h2 className={css.heading}>
                Вітаємо, іспит <span className={css.highlightSuccess}>складено!</span>
            </h2>
            
            <p className={css.resultText}>
                Чудова робота! Ви підтвердили свої знання та успішно пройшли симуляцію офіційного іспиту.
            </p>
            
            <div className={css.resultActions}>
                <button className={css.buttonOutline} onClick={onRetry}>
                    Пройти ще раз
                </button>
                <Link href="/tests" className={`${css.buttonBase} ${css.buttonSuccess}`}>
                    Повернутись до тем
                </Link>
            </div>
            
        </div>
    );
};

export default ExamSuccess;
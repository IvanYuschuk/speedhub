import React from 'react';
import Link from 'next/link';
import css from './ExamResults.module.css';

interface ExamFailProps {
    mistakesCount: number;
    onRetry: () => void;
}

const ExamFail = ({ mistakesCount, onRetry }: ExamFailProps) => {
    
    // Функція для правильного відмінювання слова (1 помилка, 2-4 помилки, 5+ помилок)
    const getMistakesWord = (count: number) => {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'помилок';
        if (lastDigit === 1) return 'помилку';
        if (lastDigit >= 2 && lastDigit <= 4) return 'помилки';
        return 'помилок';
    };

    return (
        <div className={`${css.resultCard} ${css.failCard}`}>
            
            {/* Іконка провалу (Хрестик) */}
            <div className={`${css.iconWrapper} ${css.iconFail}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>

            <h2 className={css.heading}>
                На жаль, іспит <span className={css.highlightFail}>не складено</span>
            </h2>
            
            <p className={css.resultText}>
                Ви допустили <strong>{mistakesCount}</strong> {getMistakesWord(mistakesCount)}. 
                Не здавайтесь, проаналізуйте свої відповіді та спробуйте знову!
            </p>
            
            <div className={css.resultActions}>
                <button className={css.buttonOutline} onClick={onRetry}>
                    Спробувати ще раз
                </button>
                <Link href="/tests" className={`${css.buttonBase} ${css.buttonFail}`}>
                    Повернутись до тем
                </Link>
            </div>
            
        </div>
    );
};

export default ExamFail;
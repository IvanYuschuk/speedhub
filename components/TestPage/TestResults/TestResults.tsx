import Link from "next/link";
import css from "./TestResults.module.css"

interface TestResultsProps {
    correctAnswersCount: number | undefined;
    totalQuestions: number;
    onRetry: () => void;
}

const TestResults = ({ correctAnswersCount, totalQuestions, onRetry }: TestResultsProps) => {
    return (
        <div className={css.resultCard}>
            <h2 className={css.heading}>Тест <span className={css.highlight}>завершено!</span></h2>
            <p className={css.resultText}>
                Твій результат: <strong>{correctAnswersCount} з {totalQuestions}</strong> правильних відповідей.
            </p>
            <div className={css.resultActions}>
                <button className={css.buttonOutline} onClick={onRetry}>
                    Пройти ще раз
                </button>
                <Link href="/tests" className={css.button}>
                    Повернутись до тем
                </Link>
            </div>
        </div>
    );
};

export default TestResults
import css from "./TestControls.module.css"

interface TestControlsProps {
    currentIndex: number;
    totalQuestions: number;
    isCurrentChecked: boolean;
    hasSelectedAnswer: boolean;
    onPrev: () => void;
    onNext: () => void;
    onCheck: () => void;
    onFinish: () => void;
}

const TestControls = ({ currentIndex, totalQuestions, isCurrentChecked, hasSelectedAnswer, onPrev, onNext, onCheck, onFinish }: TestControlsProps) => (
    <div className={css.navigation}>
        <button 
            className={css.navBtn} 
            onClick={onPrev} 
            disabled={currentIndex === 0}
        >
            ← Назад
        </button>

        {!isCurrentChecked ? (
            <button 
                className={css.button} 
                onClick={onCheck}
                disabled={!hasSelectedAnswer}
            >
                Відповісти
            </button>
        ) : currentIndex === totalQuestions - 1 ? (
            <button 
                className={css.button} 
                onClick={onFinish}
            >
                Завершити тест
            </button>
        ) : (
            <button 
                className={css.button} 
                onClick={onNext}
            >
                Наступне →
            </button>
        )}
    </div>
);

export default TestControls;
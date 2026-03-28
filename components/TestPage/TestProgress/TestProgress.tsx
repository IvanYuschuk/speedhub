import css from "./TestProgress.module.css";

interface TestProgressProps {
    currentIndex: number;
    totalQuestions: number
}

const TestProgress = ({ currentIndex, totalQuestions }: TestProgressProps) => {
    return (
        <div className={css.testHeader}>
            <span className={css.progressText}>
                Питання {currentIndex + 1} з {totalQuestions}
            </span>
            <div className={css.progressBar}>
                <div
                    className={css.progressFill}
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default TestProgress;
import { Test } from "@/types/tests";
import { useRef, useEffect } from "react";
import css from "./QuestionStepper.module.css";

interface QuestionStepperProps {
    questions: Test[];
    currentIndex: number;
    checkedAnswers: Record<string, boolean>;
    selectedAnswers: Record<string, number>;
    onStepClick: (index: number) => void;
}

const QuestionStepper = ({ questions, currentIndex, checkedAnswers, selectedAnswers, onStepClick }: QuestionStepperProps) => {
    const stepperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (stepperRef.current) {
            const container = stepperRef.current;
            const activeStep = container.children[currentIndex] as HTMLElement;

            if (activeStep) {
                const containerScrollLeft = container.scrollLeft;
                const containerWidth = container.clientWidth;
                const stepLeft = activeStep.offsetLeft;
                const stepRight = stepLeft + activeStep.offsetWidth;

                if (stepRight > containerScrollLeft + containerWidth) {
                    container.scrollTo({ left: stepRight - containerWidth + 24, behavior: 'smooth' });
                } else if (stepLeft < containerScrollLeft) {
                    container.scrollTo({ left: stepLeft - 24, behavior: 'smooth' });
                }
            }
        }
    }, [currentIndex]);

    return (
        <div className={css.questionStepper} ref={stepperRef}>
            {questions.map((q, index) => {
                const isChecked = checkedAnswers[q.id];
                const isCorrect = isChecked && selectedAnswers[q.id] === q.correct_option_id;
                const isIncorrect = isChecked && selectedAnswers[q.id] !== q.correct_option_id;
                const isActive = index === currentIndex;

                let statusClass = '';
                if (isCorrect) statusClass = css.stepCorrect;
                else if (isIncorrect) statusClass = css.stepIncorrect;
                else if (isActive) statusClass = css.stepActive;

                return (
                    <button
                        key={q.id}
                        type="button"
                        className={`${css.stepBtn} ${statusClass}`}
                        onClick={() => onStepClick(index)}
                        aria-label={`Перейти до питання ${index + 1}`}
                    >
                        {index + 1}
                    </button>
                );
            })}
        </div>
    );
};

export default QuestionStepper;
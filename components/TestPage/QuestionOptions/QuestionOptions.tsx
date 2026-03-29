import { Test } from "@/types/tests";
import css from "./QuestionOptions.module.css";

interface QuestionOptionsProps {
    question: Test;
    selectedAnswerId?: number;
    isCurrentChecked: boolean;
    onOptionSelect: (optionId: number) => void;
}

const QuestionOptions = ({ question, selectedAnswerId, isCurrentChecked, onOptionSelect }: QuestionOptionsProps) => {
    return (
        <div className={css.optionsList}>
            {question.options.map((option, index) => {
                const isSelected = selectedAnswerId === option.id;
                const isCorrect = option.id === question.correct_option_id;
            
                let optionStatusClass = '';
                if (isCurrentChecked) {
                    if (isCorrect) optionStatusClass = css.correct;
                    else if (isSelected && !isCorrect) optionStatusClass = css.incorrect;
                    else optionStatusClass = css.disabled;
                } else if (isSelected) {
                    optionStatusClass = css.selected;
                }

                return (
                    <button
                        key={option.id}
                        type="button"
                        className={`${css.optionBtn} ${optionStatusClass}`}
                        onClick={() => onOptionSelect(option.id)}
                    >
                        <span className={css.optionLetter}>
                            {String.fromCharCode(1040 + index)}
                        </span>
                        <span className={css.optionText}>{option.text}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default QuestionOptions;
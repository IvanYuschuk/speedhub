import Image from "next/image";
import css from "./QuestionContent.module.css"
import { Test } from "@/types/tests";

interface QuestionContentProps {
    question: Test;
}
const QuestionContent = ({ question }: QuestionContentProps) => {
    return (
        <>
            {question.image && question.image.length > 0 && (
                <ul className={css.imageBlock}>
                    {question.image.map((link, index) => (
                        <li key={index} className={css.imageItem}>
                            <Image
                                src={link}
                                alt={`Ілюстрація до питання`}
                                width={800}
                                height={450}
                                className={css.questionImage}
                            />
                        </li>
                    ))}
                </ul>
            )}
            <h2 className={css.questionTitle}>{question.question}</h2>
        </>
    );
};

export default QuestionContent;
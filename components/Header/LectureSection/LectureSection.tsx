'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import css from './LectureSection.module.css';

interface StepItem {
    id: number;
    title: string;
    text: string;
}

const stepsData: StepItem[] = [
    {
        id: 1,
        title: "Вивчай лекції",
        text: "Обирай категорії: дорожні знаки, розмітка, перехрестя або швидкісні режими, і проходь інтерактивні лекції."
    },
    {
        id: 2,
        title: "Практикуйся на тестах",
        text: "Перевіряй знання через тести по темах у форматі реального іспиту."
    },
    {
        id: 3,
        title: "Складай заліковий тест",
        text: "Підсумковий тест показує твою готовність та допомагає впевнено скласти офіційний іспит."
    }
];

const LectureSection = () => {
    const [openStep, setOpenStep] = useState<number | null>(1);

    const handleToggle = (id: number) => {
        setOpenStep(openStep === id ? null : id);
    };

    return (
        <section className={css.section}>
            <div className={css.container}>
                <div className={css.contentWrapper}>
                    
                    <div className={css.leftCol}>
                        <h2 className={css.heading}>
                            Три прості кроки до впевненої підготовки та <span className={css.highlight}>успішного складання</span> іспиту:
                        </h2>

                        <div className={css.accordion}>
                            {stepsData.map((step) => {
                                const isOpen = openStep === step.id;

                                return (
                                    <div 
                                        key={step.id} 
                                        className={`${css.stepItem} ${isOpen ? css.active : ''}`}
                                    >
                                        <button 
                                            className={css.stepHeader} 
                                            onClick={() => handleToggle(step.id)}
                                            type="button"
                                        >
                                            <div className={css.stepTitleWrapper}>
                                                <span className={css.stepNumber}>{step.id}</span>
                                                <h3 className={css.stepTitle}>{step.title}</h3>
                                            </div>
                                            <span className={css.toggleIcon}>
                                                {isOpen ? '-' : '+'}
                                            </span>
                                        </button>
                                        
                                        <div className={`${css.stepBodyWrapper} ${isOpen ? css.open : ''}`}>
                                            <div className={css.stepBody}>
                                                <p className={css.stepText}>{step.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={css.rightCol}>
                        <div className={css.imageContainer}>
                            <Image 
                                src="/images/LectureSection.png" 
                                alt="Процес навчання" 
                                className={css.image} 
                                width={600} 
                                height={400} 
                            />
                            
                            <div className={css.floatingLinkContainer}>
                                <Link href="/lectures" className={css.floatingLink}>
                                    <span className={css.linkIcon}>📚</span>
                                    Перейти до лекцій
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LectureSection;
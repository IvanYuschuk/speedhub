'use client';

import React from 'react';
import TestCard from './TestCard';
import css from './TestsSection.module.css';

// Наші початкові дані
export interface TestTheme {
    id: string;
    themeNumber: string;
    title: string;
    link: string;
}

const testsData: TestTheme[] = [
    { id: "r1", themeNumber: "Тема 1", title: "Загальні положення", link: "/tests/r1" },
    { id: "r2", themeNumber: "Тема 2", title: "Обов'язки і права водіїв механічних транспортних засобів", link: "/tests/r2" },
    { id: "r3", themeNumber: "Тема 3", title: "Рух транспортних засобів із спеціальними сигналами", link: "/tests/r3" },
    { id: "r4", themeNumber: "Тема 4", title: "Обов'язки і права пішоходів", link: "/tests/r4" },
    { id: "r5", themeNumber: "Тема 5", title: "Обов'язки і права пасажирів", link: "/tests/r5" },
    { id: "r6", themeNumber: "Тема 6", title: "Вимоги до велосипедистів", link: "/tests/r6" },
];

const TestsSectionClient = () => {
    return (
        <section className={css.section}>
            <div className={css.container}>
                <h2 className={css.heading}>
                    Тести по <span className={css.highlight}>темах</span>
                </h2>

                <div className={css.grid}>
                    {testsData.map((test) => (
                        <TestCard key={test.id} test={test} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestsSectionClient;
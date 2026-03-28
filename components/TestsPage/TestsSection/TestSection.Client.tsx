'use client';

import React from 'react';
import TestCard from './TestCard';
import css from './TestsSection.module.css';
import { testsData } from '@/types/tests';

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
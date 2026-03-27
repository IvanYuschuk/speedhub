'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getTestsByTheme } from '@/lib/api';
import css from './TestsSection.module.css'; // Використовуємо спільні стилі

// Експортуємо інтерфейс, щоб його міг використовувати головний компонент
export interface TestTheme {
    id: string;
    themeNumber: string;
    title: string;
    link: string;
}

const TestCard = ({ test }: { test: TestTheme }) => {
    // Хук useQuery тепер живе тут і відповідає лише за цю конкретну картку
    const { data, isLoading, isError } = useQuery({
        queryKey: ["tests", test.id],
        queryFn: () => getTestsByTheme(test.id),
        refetchOnMount: false,
    });

    const count = data?.length || 0;

    return (
        <Link href={test.link} className={css.card}>
            <div className={css.cardHeader}>
                <span className={css.themeBadge}>{test.themeNumber}</span>
                <span className={css.arrowIcon}>→</span>
            </div>

            <h3 className={css.cardTitle}>{test.title}</h3>

            <div className={css.cardFooter}>
                <span className={css.countLabel}>Кількість тестів:</span>
                <span className={css.countValue}>
                    {isLoading ? "..." : isError ? "Помилка" : count}
                </span>
            </div>
        </Link>
    );
};

export default TestCard;
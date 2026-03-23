// ТУТ НЕМАЄ "use client" - це серверний компонент!
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import TestsSectionClient from './TestSection.Client';
import getTestsByTheme from '@/lib/api';

export default async function TestsSection() {
    // Створюємо новий екземпляр QueryClient для цього серверного запиту
    const queryClient = new QueryClient();

    // Масив наших ID тем, для яких треба отримати дані
    const themeIds = ["r1", "r2", "r3", "r4", "r5", "r6"];

    // Робимо всі запити паралельно на сервері та кладемо їх у кеш
    await Promise.all(
        themeIds.map((id) =>
            queryClient.prefetchQuery({
                queryKey: ["tests", id],
                queryFn: () => getTestsByTheme(id),
            })
        )
    );

    return (
        // HydrationBoundary "передає" зібраний кеш клієнтським компонентам всередині
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TestsSectionClient />
        </HydrationBoundary>
    );
}
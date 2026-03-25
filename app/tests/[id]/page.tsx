import { getTestsByTheme } from "@/lib/api";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TestPageClient from "./TestPage.Client";

type Props = {
    params: Promise<{ id: string }>;
};

const TestPage = async ({ params }: Props) => {
    const { id } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["test", id],
        queryFn: () => getTestsByTheme(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TestPageClient />
        </HydrationBoundary>
    );
}

export default TestPage;
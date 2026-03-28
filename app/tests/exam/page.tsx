import { getExamTest } from "@/lib/api";
import { HydrationBoundary, QueryClient, dehydrate} from "@tanstack/react-query";
import ExamPageClient from "./ExamPage.Client";

const examPage = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["examTest"],
        queryFn: () => getExamTest(),
    })
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ExamPageClient />
        </HydrationBoundary>
    );
};

export default examPage;
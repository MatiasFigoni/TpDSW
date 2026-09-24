import { useQuery } from '@tanstack/react-query'
import { fetchCategory } from '../services/category.services.ts';

export function useCategoryId(catDescription: string) {
    return useQuery({
        queryKey: ["category"],
        queryFn: () => fetchCategory(),
        select: (categories): string => {
            const match = categories.find((item) => item.description === catDescription);
            return match ? match.id.toString() : "";
        },
        enabled: Boolean(catDescription),
    });
}

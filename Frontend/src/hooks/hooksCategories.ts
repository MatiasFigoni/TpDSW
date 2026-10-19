import { useQuery } from '@tanstack/react-query'
import { fetchCategory } from '../services/category.services.ts';

export function useCategoryId(catName: string) {
    return useQuery({
        queryKey: ["category"],
        queryFn: () => fetchCategory(),
        select: (categories): string => {
            const match = categories.find((item) => item.name === catName);
            return match ? match.id.toString() : "";
        },
        enabled: Boolean(catName),
    });
}

export function useCategory() {
    return useQuery({
        queryKey: ["category"],
        queryFn: () => fetchCategory(),
    });
}

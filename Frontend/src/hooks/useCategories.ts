import { useQuery } from '@tanstack/react-query'
import { fetchCategory } from '../services/category.services.ts';

export function useCategory() {
    return useQuery({
        queryKey: ["category"],
        queryFn: () => fetchCategory(),
    });
}

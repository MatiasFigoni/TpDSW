import { useQuery } from '@tanstack/react-query'
import { fetchCategory } from '../services/categoryServices.ts';

export function useCategory() {
    return useQuery({
        queryKey: ["category"],
        queryFn: () => fetchCategory(),
    });
}

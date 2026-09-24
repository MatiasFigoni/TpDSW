import { useQuery } from '@tanstack/react-query';
import { fetchComputers } from '../services/computer.services.ts';
export function useComputers(categoryId:string = ''){
return useQuery({
        queryKey: ['computers-map',categoryId],
        queryFn: ()=>fetchComputers(categoryId),
    },);

}
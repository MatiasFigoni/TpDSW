import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createComputer, deleteComputer, fetchComputerNumberLatestMaintenance, fetchComputersPaginated, updateComputer } from '../services/computer.services.ts';

import type { Computer, CreateComputer } from '../types/computer.class.ts';
import { fetchAviableComputers } from '../services/turns.services.ts';

export function useComputerPcNumber(computerId:string,enabled:boolean = true){
return useQuery({
        queryKey: ['computer',computerId],
        queryFn: ()=>fetchComputerNumberLatestMaintenance(computerId),
        enabled: enabled
    },);
};

export function useComputers(date:Date,hour:string,categoryId:string = ''){
return useQuery({
        queryKey: ['computers-map',date,hour,categoryId],
        queryFn: ()=>fetchAviableComputers(date,hour,categoryId),
    },);

}

export function usePaginatedComputers(page: number, limit: number = 5, categoryId: string = '') {
  return useQuery({
    queryKey: ['computers-paginated', page, limit, categoryId],
    queryFn: () => fetchComputersPaginated(page, limit, categoryId),
    placeholderData: (previousData) => previousData,
  });
}

export function useComputerModify() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params:{computer: Computer,role:string}) => updateComputer(params.computer,params.role),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['computer'] }),
				queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
				queryClient.invalidateQueries({ queryKey: ['computers-paginated'] }),
			]);
		},
	});
}

export function useComputerCreate(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params:{computer:CreateComputer,role:string}) => createComputer(params.computer,params.role),
    onSuccess: async ()=>{
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['computer'] }),
        queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
        queryClient.invalidateQueries({ queryKey: ['computers-paginated'] }),
      ]);
    },
  });
};

export function useComputerDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params:{pcNumber: string,role:string}) => deleteComputer(params.pcNumber,params.role),
    onSuccess: async (_data, { pcNumber }) => {
      queryClient.removeQueries({ queryKey: ['computer', pcNumber], exact: true });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
        queryClient.invalidateQueries({ queryKey: ['computers-paginated'] }),
      ]);
    },
  });
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComputer, deleteComputer, fetchComputerNumberLatestMaintenance, fetchComputers, updateComputer } from '../services/computer.services.ts';
import type { Computer, CreateComputer } from '../types/computer.class.ts';



export function useComputerPcNumber(computerId:string,enabled:boolean = true){
return useQuery({
        queryKey: ['computer',computerId],
        queryFn: ()=>fetchComputerNumberLatestMaintenance(computerId),
        enabled: enabled
    },);
};

export function useComputers(categoryId:string = ''){
return useQuery({
        queryKey: ['computers-map',categoryId],
        queryFn: ()=>fetchComputers(categoryId),
    },);

}

export function useComputerModify() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (computer: Computer) => updateComputer(computer),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['computer'] }),
				queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
			]);
		},
	});
}

export function useComputerCreate(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (computer:CreateComputer) => createComputer(computer),
    onSuccess: async ()=>{
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['computer'] }),
        queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
      ]);
    },
  });
};

export function useComputerDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pcNumber: string) => deleteComputer(pcNumber),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['computer'] }),
        queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
      ]);
    },
  });
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComputer, deleteComputer, fetchComputerNumberLatestMaintenance, updateComputer } from '../services/computer.services.ts';
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

export function useComputerModify() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params:{computer: Computer,role:string}) => updateComputer(params.computer,params.role),
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
    mutationFn: (params:{computer:CreateComputer,role:string}) => createComputer(params.computer,params.role),
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
    mutationFn: (params:{pcNumber: string,role:string}) => deleteComputer(params.pcNumber,params.role),
    onSuccess: async (_data, { pcNumber }) => {
      queryClient.removeQueries({ queryKey: ['computer', pcNumber], exact: true });
      await queryClient.invalidateQueries({ queryKey: ['computers-map'] });
    },
  });
}
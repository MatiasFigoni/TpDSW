import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTurns, updateTurnStatus } from '../services/turns.services.ts';
import { updatePaymentStatus } from '../services/pay.services.ts';
import type { TurnStatus } from '../types/turn.type.ts';
import type { PayStatus } from '../types/pay.type.ts';

export function useTurns() {
  return useQuery({
    queryKey: ['turns-all'],
    queryFn: fetchTurns,
    refetchInterval: 15000,
  });
}

export function useUpdateTurnStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: TurnStatus }) =>
      updateTurnStatus(id, status),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['turns-all'] }),
        queryClient.invalidateQueries({ queryKey: ['availability'] }),
        queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
      ]);
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ id, status,} : { id: number; status: PayStatus;}) => updatePaymentStatus(id, status),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['turns-all'] }),
        queryClient.invalidateQueries({ queryKey: ['availability'] }),
        queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
      ]);
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAvailableComputers,
  fetchAvailableHours,
  fetchTurns,
  updateTurnStatus,
  createTurn,
} from '../services/turn.services.ts';
import { updatePaymentStatus } from '../services/pay.services.ts';
import type { CreateTurnInput, TurnStatus } from '../types/turn.class.ts';

export function useAvailableComputers(
  date: string,
  hour: number,
  categoryId?: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['available-computers', date, hour, categoryId],
    queryFn: () => fetchAvailableComputers(date, hour, categoryId),
    enabled: enabled && !!date && hour >= 8 && hour < 24,
  });
}

export function useAvailableHours(
  date: string,
  categoryId?: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['available-hours', date, categoryId],
    queryFn: () => fetchAvailableHours(date, categoryId),
    enabled: enabled && !!date,
  });
}

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
    mutationFn: ({ id, status }: { id: number; status: TurnStatus }) =>
      updateTurnStatus(id, status),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['turns-all'] }),
        queryClient.invalidateQueries({ queryKey: ['available-computers'] }),
        queryClient.invalidateQueries({ queryKey: ['available-hours'] }),
        queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
      ]);
    },
  });
}

export function useCreateTurn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTurnInput) => createTurn(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['available-computers'] }),
        queryClient.invalidateQueries({ queryKey: ['available-hours'] }),
        queryClient.invalidateQueries({ queryKey: ['turns-all'] }),
        queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
      ]);
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: 'PENDIENTE' | 'EN_PROCESO' | 'PAGADO' | 'RECHAZADO' | 'CANCELADO' | 'REEMBOLSADO';
    }) => updatePaymentStatus(id, status),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['turns-all'] }),
        queryClient.invalidateQueries({ queryKey: ['available-computers'] }),
        queryClient.invalidateQueries({ queryKey: ['available-hours'] }),
        queryClient.invalidateQueries({ queryKey: ['computers-map'] }),
      ]);
    },
  });
}


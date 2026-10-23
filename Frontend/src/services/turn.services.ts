import { api } from './api.ts';
import type { AvailableComputersResponse, CreateTurnInput, Turn, TurnStatus } from '../types/turn.class.ts';

export async function fetchAvailableComputers(
  date: string,
  hour: number,
  categoryId?: number
): Promise<AvailableComputersResponse> {
  const params = new URLSearchParams({
    date,
    hour: hour.toString(),
  });
  if (categoryId !== undefined) {
    params.append('categoryId', categoryId.toString());
  }

  const response = await api(`/api/turns/available-computers?${params.toString()}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al buscar computadoras disponibles');
  }
  return response.json();
}

export async function fetchAvailableHours(
  date: string,
  categoryId?: number
): Promise<number[]> {
  const params = new URLSearchParams({ date });
  if (categoryId !== undefined) {
    params.append('categoryId', categoryId.toString());
  }

  try {
    const response = await api(`/api/turns/available-hours?${params.toString()}`);
    if (response.ok) {
      const result = await response.json();
      return result.availableHours;
    }
  } catch {
    // Fallback if endpoint is unavailable
  }

  // Fallback: check each hour 8..23 with /api/turns/available-computers
  const hours = Array.from({ length: 16 }, (_, i) => i + 8);
  const results = await Promise.all(
    hours.map(async (h) => {
      try {
        const res = await fetchAvailableComputers(date, h, categoryId);
        return res.totalAvailable > 0 ? h : null;
      } catch {
        return null;
      }
    })
  );
  return results.filter((h): h is number => h !== null);
}

export async function fetchTurns(): Promise<Turn[]> {
  const response = await api('/api/turns');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los turnos');
  }
  const result = await response.json();
  return result.data;
}

export async function updateTurnStatus(id: number, status: TurnStatus): Promise<Turn> {
  const response = await api(`/api/turns/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el estado del turno');
  }
  const result = await response.json();
  return result.data;
}

export async function createTurn(input: CreateTurnInput): Promise<{ message: string; data: Turn }> {
  const response = await api('/api/turns', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el turno');
  }
  return response.json();
}

import { api } from "./api.ts";
import type { Turn, TurnStatus } from "../types/turn.type.ts";

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

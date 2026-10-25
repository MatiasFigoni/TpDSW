import { api } from "./api.ts";
import type { Turn } from "../types/turn.type.ts";
import type { AvailabilityResponse, CreateTurnPayload } from "../types/reservation.types.ts";

export async function fetchAvailability(
    date: string,
    hour: number,
    duration: number,
    categoryId?: number,
): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({
        date,
        hour: String(hour),
        duration: String(duration),
    });
    if (categoryId !== undefined) params.append("categoryId", String(categoryId));

    const response = await api(`/api/turns/available-computers?${params.toString()}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "No se pudo consultar la disponibilidad");
    }
    return response.json();
}

export async function createTurn(payload: CreateTurnPayload): Promise<Turn> {
    const response = await api("/api/turns", {
        method: "POST",
        body: JSON.stringify({ status: "PENDIENTE", ...payload }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "No se pudo crear la reserva");
    }
    const result = await response.json();
    return result.data;
}

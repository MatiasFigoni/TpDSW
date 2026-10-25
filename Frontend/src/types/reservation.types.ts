import type { Category } from "./category.class.ts";
import type { Computer } from "./computer.class.ts";

//Pasos de una reserva
export const RESERVATION_STEPS = [
    { id: 1, title: "Elegí el tipo de equipo", short: "Equipo" },
    { id: 2, title: "Elegí fecha y horario", short: "Horario" },
    { id: 3, title: "Elegí tu computadora", short: "PC" },
    { id: 4, title: "Confirmá tu reserva", short: "Confirmar" },
] as const;

export type ReservationStep = (typeof RESERVATION_STEPS)[number]["id"];

//Plantilla de reserva
export interface ReservationDraft {
    category: Category | null;
    date: string | null;
    hour: number | null;
    duration: number;
    computer: Computer | null;
}

export const EMPTY_DRAFT: ReservationDraft = {
    category: null,
    date: null,
    hour: null,
    duration: 1,
    computer: null,
};

/** Respuesta del endpoint GET /api/turns/available-computers */
export interface AvailabilityResponse {
    date: string;
    slot: string;
    duration: number;
    startTime: string;
    endTime: string;
    totalAvailable: number;
    data: Computer[];
}

/** Payload para POST /api/turns */
export interface CreateTurnPayload {
    computerId: string | number;
    clientId: number;
    startTime: string;
    endTime: string;
    status?: string;
}

/** Horario del local: abre 8hs, cierra 24hs, cerrado los lunes. */
export const OPENING_HOUR = 8;
export const CLOSING_HOUR = 24;
export const CLOSED_WEEKDAY = 1; // Lunes
export const MAX_DURATION = 3;
export const BOOKING_WINDOW_DAYS = 14;

import type { Computer } from "./computer.class.ts";
import type { Person } from "./person.class.ts";

export const EstadoTurno = {
    Pendiente: 'pendiente',
    Reservado: 'reservado',
    Finalizado: 'finalizado'
} as const;
export type EstadoTurno = (typeof EstadoTurno)[keyof typeof EstadoTurno];

export interface Turn {
    id: number;
    dateTime: Date | string;
    startTime: Date | string;
    endTime: Date | string;
    duration: number;
    extraPrice: number;
    status: EstadoTurno;
    computers: Computer;
    clients: Person;
}
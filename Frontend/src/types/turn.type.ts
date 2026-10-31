import type { Computer } from "./computer.class.ts";
import type { Person } from "./person.class.ts";

export type TurnStatus = 'PENDIENTE' | 'RESERVADO' | 'INICIADO' | 'FINALIZADO' | 'CANCELADO';

export interface PayInfo {
    id: number;
    amount: number;
    status: string;
    date: string;
    method: string;
    transactionId: string;
}

export interface Turn {
    id: number;
    dateTime: string;
    startTime: string;
    endTime: string;
    duration: number;
    extraPrice: number;
    status: TurnStatus;
    computer: Computer;
    client: Person;
    pays?: PayInfo[];
}

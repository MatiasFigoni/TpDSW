import type { Turn } from "./turn.type.ts";

export type PayStatus = 'PENDIENTE' | 'EN_PROCESO' | 'PAGADO' | 'RECHAZADO' | 'CANCELADO' | 'REEMBOLSADO';

export type PaymentMethod = 'efectivo' | 'tarjeta';

export interface updatePaymentStatus{
    message:string;
    date:{
        payId:number;
        transactionId: number;
        paymentStatus:string;
        turnId:number;
        turnStatus:string;
    }
}

export interface PayResponse {
    message: string;
    data: {
        id: number;
        amount: number;
        status: PayStatus;
        date: Date;
        method: PaymentMethod;
        transactionId: string;
        turn: Turn;
    };
    turnStatus: string;
}

export interface CreatePayInput {
    idTurn: number;
    amount: number;
    method: PaymentMethod;
    status?: PayStatus;
}

export interface PaymentInfo {
    transactionId: string;
    status: PayStatus;
    method: PaymentMethod;
}

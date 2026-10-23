import type { Computer } from "./computer.class.ts";
import type { Person } from "./person.class.ts";

export const EstadoTurno = {
    Pendiente : 'pendiente',
    Reservado : 'reservado',
    Finalizado : 'finalizado'
} as const;

export class Turn{
    id:number;
    dateTime:Date;
    startTime:Date;
    endTime:Date;
    duration:number;
    extraPrice:number;
    status:String;
    computers: Computer;
    clients:Person;
    // pay:Pay[];

    constructor(
    id:number,
    dateTime:Date,
    startTime:Date,
    endTime:Date,
    duration:number,
    extraPrice:number,
    status:String,
    computers: Computer,
    clients:Person,){
        
    this.id = id;
    this.dateTime = dateTime;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = duration;
    this.extraPrice = extraPrice;
    this.status = status;
    this.computers = computers;
    this.clients = clients;
    }
}
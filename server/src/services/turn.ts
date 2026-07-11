import crypto from 'node:crypto';

export class Turn {
  idClient: string="";
  idComputer: string="";
  idEmployee: string="";
  horaInicio: Date = new Date(); //mirar bien
  horainicioReal: Date = new Date(); //mirar bien
  horaFin: Date = new Date(); //mirar bien
  duration: number = 0;
  price: number = 0;
  TPrice: number = 0;
  estado: string = "pendiente"; //pendiente pago ; pagado; cancelado; finalizado.
  id: string = crypto.randomUUID();

  
}
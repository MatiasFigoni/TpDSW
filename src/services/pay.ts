import crypto from 'node:crypto';

export class pay {
  #amount: number=0;
  fecha: Date = new Date();
  #status: string="pendiente"; //pendiente pago ; pagado; cancelado
  idTurn: string="";
  idpay: string = crypto.randomUUID();
}
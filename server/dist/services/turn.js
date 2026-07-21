import crypto from 'node:crypto';
export class Turn {
    constructor() {
        this.idClient = "";
        this.idComputer = "";
        this.idEmployee = "";
        this.horaInicio = new Date(); //mirar bien
        this.horainicioReal = new Date(); //mirar bien
        this.horaFin = new Date(); //mirar bien
        this.duration = 0;
        this.price = 0;
        this.TPrice = 0;
        this.estado = "pendiente"; //pendiente pago ; pagado; cancelado; finalizado.
        this.id = crypto.randomUUID();
    }
}
//# sourceMappingURL=turn.js.map
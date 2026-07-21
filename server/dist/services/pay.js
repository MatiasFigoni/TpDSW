var _pay_amount, _pay_status;
import crypto from 'node:crypto';
export class pay {
    constructor() {
        _pay_amount.set(this, 0);
        this.fecha = new Date();
        _pay_status.set(this, "pendiente"); //pendiente pago ; pagado; cancelado
        this.idTurn = "";
        this.idpay = crypto.randomUUID();
    }
}
_pay_amount = new WeakMap(), _pay_status = new WeakMap();
//# sourceMappingURL=pay.js.map
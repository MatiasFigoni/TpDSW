import crypto from 'node:crypto';
import { Person } from './person.entity.js';
export class Client extends Person {
    constructor() {
        super(...arguments);
        this.status = true;
        this.id = crypto.randomUUID();
    }
}
//# sourceMappingURL=client.entity.js.map
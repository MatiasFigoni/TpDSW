import crypto from 'node:crypto';
import { Person } from './person.entity.js';
export class Employee extends Person {
    constructor() {
        super(...arguments);
        this.username = "";
        this.password = "";
        this.id = crypto.randomUUID();
    }
}
//# sourceMappingURL=employee.entity.js.map
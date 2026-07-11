import crypto from 'node:crypto';
import { Person } from './person.entity.js';

export class Client extends Person {
  status: boolean = true;
  id: string = crypto.randomUUID();
}
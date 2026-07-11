import crypto from 'node:crypto';
import { Person } from './person.entity.js';

export class Employee extends Person {
  username: string="";
  password: string="";
  id: string = crypto.randomUUID();

}
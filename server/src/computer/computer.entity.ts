import { ObjectId } from 'mongodb';
import crypto from 'node:crypto';


export class Computer {
  status: boolean = false;
  constructor(
    public category: string, 
    public description: string, 
    public price: number, 
    public pcNumber: number, 
    public _id?: ObjectId)
    {}
}
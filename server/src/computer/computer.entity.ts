import crypto from 'node:crypto';

export class Computer {
  #status= false;
  constructor(
    public category: string, 
    public description: string, 
    public price: number, 
    public pcNumber: number, 
    public id= crypto.randomUUID())
    {}
}
export class Computer {
    _id: string;
    category: string;
    description: string;
    price: number;
    pcNumber: number;
    status: boolean;
    
    constructor(_id: string, category: string, description: string, price: number, pcNumber: number, status: boolean,) {
        this._id = _id;
        this.category = category;
        this.description = description;
        this.price = price;
        this.pcNumber = pcNumber;
        this.status = status;
    }
}
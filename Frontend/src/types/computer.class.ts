export class Computer {
    category: string;
    description: string;
    price: number;
    pcNumber: number;
    constructor(category: string, description: string, price: number, pcNumber: number,) {
        this.category = category;
        this.description = description;
        this.price = price;
        this.pcNumber = pcNumber;
    }
}
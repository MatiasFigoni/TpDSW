import { Category } from './category.class.ts';
export class Computer {
    id: string;
    category: Category;
    description: string;
    price: number;
    pcNumber: number;
    status: string;

    constructor(id: string, category: Category, description: string, price: number, pcNumber: number, status: string,) {
        this.id = id;
        this.category = category;
        this.description = description;
        this.price = price;
        this.pcNumber = pcNumber;
        this.status = status;
    }
}
import { Category } from './category.class.ts';
import type { Maintenance } from './maintenance.class.ts';
export class Computer {
    id: string;
    category: Category;
    description: string;
    maintenance:Maintenance;
    pcNumber: number;
    status: string;

    constructor(id: string, category: Category, description: string, pcNumber: number, status: string, maintenance:Maintenance,) {
        this.id = id;
        this.category = category;
        this.description = description;
        this.maintenance = maintenance;
        this.pcNumber = pcNumber;
        this.status = status;
    }
}
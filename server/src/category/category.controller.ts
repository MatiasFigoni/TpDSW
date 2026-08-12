import { Request, Response } from 'express'; 
import { CategoryService } from './category.service.js'; 

export class CategoryController {
    service: CategoryService;

    constructor(service: CategoryService) {
        this.service = service;
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.getAll();
            res.status(200).json({ message: 'Categorías encontradas', data: result });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
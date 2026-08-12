/*category.routes.ts */
import { Router, Request, Response } from 'express';
import { CategoryController } from './category.controller.js'; 
import { CategoryRepository } from './category.repository.js'; 
import { CategoryService } from './category.service.js'; 
import { orm } from '../shared/db/orm.js'; 

const repository = new CategoryRepository(orm.em);
const service = new CategoryService(repository);
const controller = new CategoryController(service);

const router = Router();

router.get('/', (req: Request, res: Response) => {
    controller.getAll(req, res);
});

export default router;
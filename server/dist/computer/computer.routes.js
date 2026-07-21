import { Router } from 'express';
import { sanitizeComputerData, findAll, findOne, add, update, remove } from './computer.controler.js';
export const computerRouter = Router();
computerRouter.get('/', findAll);
computerRouter.get('/:id', findOne);
computerRouter.post('/', sanitizeComputerData, add);
computerRouter.patch('/:id', sanitizeComputerData, update);
computerRouter.put('/:id', sanitizeComputerData, update);
computerRouter.delete('/:id', remove);
//# sourceMappingURL=computer.routes.js.map
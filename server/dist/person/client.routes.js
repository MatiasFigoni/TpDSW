import { Router } from 'express';
import { sanitizeClientData, findAll, findOne, add, update, remove } from './client.controler.js';
export const clientRouter = Router();
clientRouter.get('/', findAll);
clientRouter.get('/:id', findOne);
clientRouter.post('/', sanitizeClientData, add);
clientRouter.patch('/:id', sanitizeClientData, update);
clientRouter.put('/:id', sanitizeClientData, update);
clientRouter.delete('/:id', remove);
//# sourceMappingURL=client.routes.js.map
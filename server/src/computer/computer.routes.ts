import { Router } from 'express';
import {  sanitizeComputerData, findAll, findOne, add, update, remove, filter, filterByCategory } from './computer.controler.js';
import { requireAdmin } from '../shared/middlewares/AdminMiddleware.js';
import { validateId } from '../shared/middlewares/middlewareForIdValidating.js';


export const computerRouter = Router();

computerRouter.get('/filter', filter);
computerRouter.get('/category/:categoryId', filterByCategory);
computerRouter.get('/', findAll);
computerRouter.get('/:id', findOne);


computerRouter.post('/', requireAdmin, sanitizeComputerData, add);
computerRouter.patch('/:id', requireAdmin, validateId, sanitizeComputerData, update)
computerRouter.put('/:id', requireAdmin,validateId, sanitizeComputerData, update);
computerRouter.delete('/:id', requireAdmin, validateId, remove);

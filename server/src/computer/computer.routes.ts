import { Router } from 'express';
import {  sanitizeComputerData, findAll, findOne, add, update, remove, filter, filterByCategory, findOneLatestMaintenance } from './computer.controler.js';

export const computerRouter = Router();

computerRouter.get('/filter', filter);
computerRouter.get('/category/:categoryId', filterByCategory);
computerRouter.get('/', findAll);
computerRouter.get('/:id', findOne);
computerRouter.get('/:pcNumber/maintenance/latest',findOneLatestMaintenance);
computerRouter.post('/', sanitizeComputerData, add);
computerRouter.patch('/:id', sanitizeComputerData, update)
computerRouter.put('/:id', sanitizeComputerData, update);
computerRouter.delete('/:id', remove);
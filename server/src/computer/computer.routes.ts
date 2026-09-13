import { Router } from 'express';
import {  sanitizeComputerData, findAll, findOne, add, update, remove, filter, filterByCategory } from './computer.controler.js';

export const computerRouter = Router();

computerRouter.get('/filter', filter);
computerRouter.get('/category/:categoryId', filterByCategory);
computerRouter.get('/', findAll);
computerRouter.get('/:id', findOne);
computerRouter.post('/', sanitizeComputerData, add);
computerRouter.patch('/:id', sanitizeComputerData, update)
computerRouter.put('/:id', sanitizeComputerData, update);
computerRouter.delete('/:id', remove);
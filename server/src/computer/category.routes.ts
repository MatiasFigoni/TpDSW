import { Router } from 'express';
import {  sanitizeCategoryData, findAll, findOne, add, update, remove  } from './category.controller.js';

export const CategoryRouter = Router();

CategoryRouter.get('/', findAll);
CategoryRouter.get('/:id', findOne);
CategoryRouter.post('/', sanitizeCategoryData, add);
CategoryRouter.patch('/:id', sanitizeCategoryData, update)
CategoryRouter.put('/:id', sanitizeCategoryData, update);
CategoryRouter.delete('/:id', remove);
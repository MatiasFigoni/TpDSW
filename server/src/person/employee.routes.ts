import { Router } from 'express';
import {  sanitizeEmployeeData, findAll, findOne, add, update, remove  } from './employee.controler.js';

export const employeeRouter = Router();

employeeRouter.get('/', findAll);
employeeRouter.get('/:id', findOne);
employeeRouter.post('/', sanitizeEmployeeData, add);
employeeRouter.patch('/:id', sanitizeEmployeeData, update)
employeeRouter.put('/:id', sanitizeEmployeeData, update);
employeeRouter.delete('/:id', remove);
import { Router } from 'express';
import {  sanitizeEmployeeData, findAll, findOne, add, update, remove,validateEmailAndPassword   } from './employee.controler.js';
import { validateAndSanitizeLogin } from '../shared/middlewares/middlewareWeUsing.js'
import { requireAdmin } from '../shared/middlewares/AdminMiddleware.js';
import { validateId } from '../shared/middlewares/middlewareForIdValidating.js';


export const employeeRouter = Router();

employeeRouter.get('/', findAll);
employeeRouter.get('/:id', validateId, findOne);
employeeRouter.post('/', sanitizeEmployeeData, add);
employeeRouter.patch('/:id', validateId,  requireAdmin, sanitizeEmployeeData, update)
employeeRouter.put('/:id', sanitizeEmployeeData, validateId, requireAdmin, update);
employeeRouter.delete('/:id', requireAdmin, validateId, remove);
employeeRouter.post('/login', validateAndSanitizeLogin, validateEmailAndPassword)
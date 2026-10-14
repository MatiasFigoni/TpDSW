import { Router } from 'express';
import {  sanitizeClientData, findAll, findOne, add, update, remove, validateEmailAndPassword  } from './client.controler.js';
import { validateAndSanitizeLogin } from '../shared/middlewares/middlewareWeUsing.js'
import { requireAdmin } from '../shared/middlewares/AdminMiddleware.js';
import { validateId } from '../shared/middlewares/middlewareForIdValidating.js';

export const clientRouter = Router();

clientRouter.get('/', findAll);
clientRouter.get('/:id', validateId,  findOne);
clientRouter.post('/',  sanitizeClientData, add);
clientRouter.patch('/:id', validateId, sanitizeClientData, update)
clientRouter.put('/:id', requireAdmin, validateId, sanitizeClientData, update);
clientRouter.delete('/:id',requireAdmin, validateId, remove);
clientRouter.post('/login' , validateAndSanitizeLogin, validateEmailAndPassword)
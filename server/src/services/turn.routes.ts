import { Router } from 'express';
import { sanitizeTurnInput, createTurn, findAvailableComputers, findAll,findOne,updateTurn, removeTurn} from './turn.controller.js';

export const turnRouter = Router();

turnRouter.get('/available-computers', findAvailableComputers);
turnRouter.post('/', sanitizeTurnInput, createTurn);
turnRouter.get('/', findAll);
turnRouter.get('/:id', findOne);
turnRouter.patch('/:id', sanitizeTurnInput, updateTurn);
turnRouter.delete('/:id', removeTurn);

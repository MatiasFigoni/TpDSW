import { Router } from 'express';
import {
  createPay,
  updatePaymentStatus,
  findAll,
  findOne,
} from './pay.controller.js';
import { sanitizePayInput } from './pay.controller.js';

export const payRouter = Router();

payRouter.get('/', findAll);
payRouter.get('/:id', findOne);
payRouter.post('/', sanitizePayInput, createPay);
payRouter.patch('/:id/status', sanitizePayInput, updatePaymentStatus);
import { Router } from 'express';
import { sanitizeEmployeeData, findAll, findOne, add, update, remove, validateEmailAndPassword } from './employee.controler.js';
export const employeeRouter = Router();
employeeRouter.get('/', findAll);
employeeRouter.get('/:id', findOne);
employeeRouter.post('/', sanitizeEmployeeData, add);
employeeRouter.patch('/:id', sanitizeEmployeeData, update);
employeeRouter.put('/:id', sanitizeEmployeeData, update);
employeeRouter.delete('/:id', remove);
employeeRouter.post('/login', validateEmailAndPassword);
//# sourceMappingURL=employee.routes.js.map
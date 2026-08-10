import { Router } from 'express';
import { sanitizeMaintenanceData, findAll, findOne, add, update, remove  } from './maintenance.controller.js';

export const MaintenanceRouter = Router();

MaintenanceRouter.get('/', findAll);
MaintenanceRouter.get('/:id', findOne);
MaintenanceRouter.post('/', sanitizeMaintenanceData, add);
MaintenanceRouter.patch('/:id', sanitizeMaintenanceData, update)
MaintenanceRouter.put('/:id', sanitizeMaintenanceData, update);
MaintenanceRouter.delete('/:id', remove);
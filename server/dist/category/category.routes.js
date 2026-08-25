/*category.routes.ts */
import { Router } from 'express';
import { sanitizeCategoryData, findAll, findOne, add, update, remove } from './category.controller.js';
const router = Router();
router.get('/', findAll);
router.get('/:id', findOne);
router.post('/', sanitizeCategoryData, add);
router.put('/:id', sanitizeCategoryData, update);
router.delete('/:id', remove);
export default router;
//# sourceMappingURL=category.routes.js.map
//# sourceMappingURL=category.routes.js.map
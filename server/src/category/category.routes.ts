/*category.routes.ts */
import { Router } from 'express';
import { sanitizeCategoryData, findAll, findOne, add, update, remove } from './category.controller.js';
import { requireAdmin } from '../shared/middlewares/AdminMiddleware.js';
import { validateId } from '../shared/middlewares/middlewareForIdValidating.js';


const router = Router();
router.get('/', findAll);

router.get('/:id', validateId, findOne);

router.post('/', requireAdmin,sanitizeCategoryData, add ) ;

router.put('/:id',requireAdmin, validateId,  sanitizeCategoryData, update );
    
router.delete('/:id',requireAdmin, validateId, sanitizeCategoryData, remove);

export default router;
//# sourceMappingURL=category.routes.js.map
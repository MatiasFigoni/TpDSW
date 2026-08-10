import { orm } from '../shared/db/orm.js';
import { Category } from './category.entity.js';
const em = orm.em;
function sanitizeCategoryData(req, res, next) {
    req.body.sanitizedInput = {
        price: req.body.price,
        description: req.body.description,
    };
    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
// async function findAll(req: Request, res: Response) {
//  try {
//     const id = Number.parseInt(req.params.id)
//     const category = await em.findOneOrFail(Category,{id})
//     res.status(200).json({ message: 'found category', data:category})
//   } catch (error:any) {
//     res.status(500).json({ message: error.message })
//   }
// }
async function findAll(req, res) {
    try {
        const category = await em.find(Category, {});
        res
            .status(200)
            .json({ message: 'found all categories', data: category });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const category = await em.findOneOrFail(Category, { id });
        res.status(200).json({ message: 'found category', data: category });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const category = em.create(Category, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'Category created', data: category });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const categoryToUpdate = await em.findOneOrFail(Category, { id });
        em.assign(categoryToUpdate, req.body.sanitizedInput);
        await em.flush();
        res
            .status(200)
            .json({ message: 'Category updated', data: categoryToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const category = em.getReference(Category, id);
        await em.remove(category);
        await em.flush();
        res.status(200).json({ message: 'Category removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeCategoryData, findAll, findOne, add, update, remove };
//# sourceMappingURL=category.controller.js.map
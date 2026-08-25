import { Category } from './category.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;
function sanitizeCategoryData(req, res, next) {
    req.body.sanitizedInput = {
        description: req.body.description,
        hourly_price: req.body.hourly_price
    };
    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const result = await em.find(Category, {});
        res.status(200).json({ message: 'Categories found', data: result });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const catid = +req.params.id;
        const ret = await em.findOneOrFail(Category, { id: catid });
        res.status(200).json({ message: 'category found ', data: ret });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        em.create(Category, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'The Category has succesfuly been created' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const info = req.body;
        const idToSearch = +req.params.id;
        const categoryFound = await em.findOneOrFail(Category, { id: idToSearch });
        em.assign(categoryFound, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: 'The Category has succefuly been updated' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const idOfCategoryToDelete = +req.params.id;
        const catToDelete = await em.findOneOrFail(Category, { id: idOfCategoryToDelete });
        em.remove(catToDelete);
        await em.flush();
        res.status(200).json({ message: ' the Category has succesfully been deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeCategoryData, findAll, findOne, add, update, remove };
//# sourceMappingURL=category.controller.js.map
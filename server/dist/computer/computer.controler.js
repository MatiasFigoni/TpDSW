import { Computer } from './computer.entity.js';
import { Maintenance } from './maintenance.entity.js';
import { orm } from '../shared/db/orm.js';
/* import { computerRouter } from './computer.routes.js'; */
//Realizar CRUD de Computadoras.
//Realizar cambio de estado de computadoras (disponible/no disponible) con un endpoint específico para ello.
//Pasar todo a sql
// maintenance: req.body.maintenance, 
const em = orm.em;
function sanitizeComputerData(req, res, next) {
    req.body.sanitizedInput = {
        maintenance: req.body.maintenance,
        category: req.body.category,
        pcNumber: req.body.pcNumber,
        description: req.body.description,
        status: req.body.status
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
        const computer = await em.find(Computer, {}, { populate: ['category', 'maintenance'] });
        if (computer.length === 0)
            return res.status(404).json({
                message: 'the computer database is empty.',
                data: [],
            });
        res.json({ message: 'found all computers', data: computer });
    }
    catch (error) {
        res.status(500).json({ message: error.mesage });
    }
}
async function findOne(req, res) {
    try {
        const pcNumber = Number.parseInt(req.params.id);
        const computer = await em.findOneOrFail(Computer, { pcNumber }, { populate: ['category', 'maintenance'] });
        res.status(200).json({ message: 'found computer', data: computer });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOneLatestMaintenance(req, res) {
    try {
        const pcNumber = Number.parseInt(req.params.pcNumber);
        const computer = await em.findOneOrFail(Computer, { pcNumber }, { populate: ['category'],
        });
        const latestMaintenance = await em.findOne(Maintenance, { computer: computer.id }, { orderBy: { start_date: 'desc', id: 'desc' },
        });
        res.status(200).json({
            message: 'found computer with latest maintenance',
            data: {
                id: computer.id,
                description: computer.description,
                category: computer.category,
                pcNumber: computer.pcNumber,
                status: computer.status,
                maintenance: latestMaintenance ?? null,
            },
        });
    }
    catch (error) {
        res.status(505).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const { maintenance, ...computerData } = req.body.sanitizedInput;
        const computer = em.create(Computer, computerData);
        await em.flush();
        res.status(201).json({ message: 'Computer created', data: computer });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const pcNumber = Number.parseInt(req.params.id);
        const computerToUpdate = await em.findOneOrFail(Computer, { pcNumber });
        const { maintenance, ...computerData } = req.body.sanitizedInput;
        em.assign(computerToUpdate, computerData);
        await em.flush();
        res
            .status(200)
            .json({ message: 'Computer updated', data: computerToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const pcNumber = Number.parseInt(req.params.id);
        const computer = await em.findOneOrFail(Computer, { pcNumber });
        await em.remove(computer);
        await em.flush();
        res.status(200).json({ message: 'Computer removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function filter(req, res) {
    try {
        const { category, status, maintenance } = req.query;
        const filters = {};
        if (category) {
            const categoryId = Number(category);
            if (!Number.isNaN(categoryId)) {
                filters.category = categoryId;
            }
        }
        if (status !== undefined) {
            filters.status = status;
        }
        if (maintenance) {
            const maintenanceId = Number(maintenance);
            if (!Number.isNaN(maintenanceId)) {
                filters.maintenance = maintenanceId;
            }
        }
        const computers = await em.find(Computer, filters, {
            populate: ['category', 'maintenance'],
        });
        res.json({ message: 'Computers found', data: computers });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function filterByCategory(req, res) {
    try {
        const categoryId = Number.parseInt(req.params.categoryId);
        const computers = await em.find(Computer, { category: categoryId }, { populate: ['category', 'maintenance'] });
        res.json({ message: 'Computers found by category', data: computers });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeComputerData, findAll, findOne, add, update, remove, filter, filterByCategory, findOneLatestMaintenance };
//# sourceMappingURL=computer.controler.js.map
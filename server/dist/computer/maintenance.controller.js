import { Maintenance } from './maintenance.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;
function sanitizeMaintenanceData(req, res, next) {
    req.body.sanitizedInput = {
        status: req.body.status,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
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
        const maintenance = await em.find(Maintenance, {});
        if (maintenance.length === 0)
            return res.status(404).json({
                message: 'the maintenance database is empty.',
                data: [],
            });
        res.json({ message: 'found all maintenance records', data: maintenance });
    }
    catch (error) {
        res.status(500).json({ message: error.mesage });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const maintenance = await em.findOneOrFail(Maintenance, { id });
        res.status(200).json({ message: 'found maintenance record', data: maintenance });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const maintenance = em.create(Maintenance, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'Maintenance record created', data: maintenance });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const maintenanceToUpdate = await em.findOneOrFail(Maintenance, { id });
        em.assign(maintenanceToUpdate, req.body.sanitizedInput);
        await em.flush();
        res
            .status(200)
            .json({ message: 'Maintenance record updated', data: maintenanceToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const maintenance = em.getReference(Maintenance, id);
        await em.remove(maintenance);
        await em.flush();
        res.status(200).json({ message: 'Maintenance record removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeMaintenanceData, findAll, findOne, add, update, remove };
//# sourceMappingURL=maintenance.controller.js.map
import { orm } from '../shared/db/orm.js';
import { Employee } from './employee.entity.js';
// import {t} from '@mikro-orm/core'
const em = orm.em;
function sanitizeEmployeeData(req, res, next) {
    req.body.sanitizedInput = {
        name: req.body.name,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        dni: req.body.dni,
        username: req.body.username,
        password: req.body.password
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
        const employee = await em.find(Employee, {});
        res.status(200).json({ message: 'found all employee', data: employee });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const employee = await em.findOneOrFail(Employee, { id });
        res.status(200).json({ message: 'found employee', data: employee });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const employee = em.create(Employee, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'New Employee created', data: employee });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const employeeToUpdate = await em.findOneOrFail(Employee, { id });
        em.assign(employeeToUpdate, req.body.sanitizedInput);
        await em.flush();
        res
            .status(200)
            .json({ message: 'Employee updated', data: employeeToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const employee = em.getReference(Employee, id);
        await em.remove(employee);
        await em.flush();
        res.status(200).json({ message: 'employee removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeEmployeeData, findAll, findOne, add, update, remove };
//# sourceMappingURL=employee.controler.js.map
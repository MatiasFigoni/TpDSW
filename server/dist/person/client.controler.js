import { orm } from '../shared/db/orm.js';
import { Client } from './client.entity.js';
// import {t} from '@mikro-orm/core'
const em = orm.em;
function sanitizeClientData(req, res, next) {
    req.body.sanitizedInput = {
        name: req.body.name,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        dni: req.body.dni,
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
        const client = await em.find(Client, {});
        res.status(200).json({ message: 'found all Client', data: client });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const client = await em.findOneOrFail(Client, { id });
        res.status(200).json({ message: 'found Client', data: client });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const client = em.create(Client, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'New Client created', data: client });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const clientToUpdate = await em.findOneOrFail(Client, { id });
        em.assign(clientToUpdate, req.body.sanitizedInput);
        await em.flush();
        res
            .status(200)
            .json({ message: 'client updated', data: clientToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const client = em.getReference(Client, id);
        await em.remove(client);
        await em.flush();
        res.status(200).json({ message: 'Client removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeClientData, findAll, findOne, add, update, remove };
//# sourceMappingURL=client.controler.js.map
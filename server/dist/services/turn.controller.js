import { Turn } from './turn.entity.js';
import { Computer } from '../computer/computer.entity.js';
import { orm } from '../shared/db/orm.js';
import { Client } from '../person/client.entity.js';
// En turn.middleware.ts:
export function sanitizeTurnInput(req, res, next) {
    req.body.sanitizedInput = {
        computerId: req.body.computerId,
        clientId: req.body.clientId,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        extraPrice: req.body.extraPrice,
        status: req.body.status,
        isGuest: req.body.isGuest,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
///
export async function findAvailableComputers(req, res) {
    try {
        const em = orm.em.fork();
        const { date, hour, categoryId } = req.query;
        if (!date || !hour) {
            return res.status(400).json({
                message: 'Parametros obligatorios faltantes: date (YYYY-MM-DD) y hour (HH:MM) entre 8 a 24'
            });
        }
        const startHour = Number(hour);
        if (isNaN(startHour) || startHour < 8 || startHour >= 24) {
            return res.status(400).json({
                message: 'La hora debe ser un número entre 8 y 24'
            });
        }
        const [year, month, day] = date.split('-').map(Number);
        const targetDate = new Date(year, month - 1, day);
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({
                message: 'La fecha debe tener el formato YYYY-MM-DD'
            });
        }
        if (targetDate.getDay() === 1) {
            return res.status(400).json({
                message: 'El local esta cerrado los Lunes, por favor elija otro dia.'
            });
        }
        const startTime = new Date(year, month - 1, day, startHour, 0, 0, 0);
        const endTime = new Date(year, month - 1, day, startHour + 1, 0, 0, 0);
        const collidingTurns = await em.find(Turn, {
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
            status: { $in: ['PENDIENTE', 'RESERVADO'] },
        });
        const occupiedComputerIds = collidingTurns.map((turn) => turn.computer.id);
        const computerFilter = {
            status: 'Disponible',
        };
        if (occupiedComputerIds.length > 0) {
            computerFilter.id = { $nin: occupiedComputerIds };
        }
        if (categoryId) {
            const catId = Number(categoryId);
            if (!isNaN(catId)) {
                computerFilter.category = catId;
            }
        }
        const availableComputers = await em.find(Computer, computerFilter, { populate: ['category'] });
        return res.status(200).json({
            date,
            slot: `${String(startHour).padStart(2, '0')}:00 - ${String(startHour + 1).padStart(2, '0')}:00`,
            // startTime: `${date}T${String(startHour).padStart(2, '0')}:00:00`,
            // endTime: `${date}T${String(startHour + 1).padStart(2, '0')}:00:00`,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            totalAvailable: availableComputers.length,
            data: availableComputers,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
    ;
}
//Create (post /api/turns)
export async function createTurn(req, res) {
    try {
        const em = orm.em.fork();
        const input = req.body.sanitizedInput;
        if (!input.computerId || !input.clientId || !input.startTime || !input.endTime) {
            return res.status(400).json({ message: 'Faltan datos obligatorios para crear el turno.' });
        }
        const start = new Date(input.startTime);
        const end = new Date(input.endTime);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Formato de fecha u hora inválido.' });
        }
        const computer = await em.findOne(Computer, { id: Number(input.computerId) }, { populate: ['category'] });
        if (!computer) {
            return res.status(404).json({ message: `La computadora con ID ${input.computerId} no existe.` });
        }
        const client = await em.findOne(Client, { id: Number(input.clientId) });
        if (!client) {
            return res.status(404).json({ message: `El cliente con ID ${input.clientId} no existe.` });
        }
        if (computer.status !== 'Disponible') {
            return res.status(400).json({ message: `La computadora #${computer.pcNumber} no está disponible (Estado: ${computer.status}).` });
        }
        const turnsPc = await em.find(Turn, {
            computer: computer.id,
            status: { $in: ['RESERVADO', 'PENDIENTE'] },
            startTime: { $lt: end },
            endTime: { $gt: start },
        });
        if (turnsPc.length > 0) {
            return res.status(400).json({ message: `La computadora #${computer.pcNumber} ya tiene un turno activo en el horario solicitado.` });
        }
        const turnsClient = await em.find(Turn, {
            client: client.id,
            status: { $in: ['RESERVADO', 'PENDIENTE'] },
            startTime: { $lt: end },
            endTime: { $gt: start },
        });
        if (turnsClient.length > 0) {
            const mismoTurno = turnsClient.some((t) => t.computer.id === computer.id);
            if (mismoTurno) {
                return res.status(409).json({
                    message: 'El cliente ya cuenta con un turno registrado para esta misma máquina y horario.',
                });
            }
            if (!input.isGuest) {
                return res.status(409).json({
                    message: 'El cliente ya tiene un turno activo en el mismo horario. Si es para un invitado, por favor indique "isGuest: true".',
                });
            }
        }
        const durationHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60)) || 1;
        const turn = em.create(Turn, {
            dateTime: start,
            startTime: start,
            endTime: end,
            duration: durationHours,
            extraPrice: Number(input.extraPrice ?? 0),
            status: input.status ?? 'PENDIENTE',
            computer,
            client,
        });
        await em.flush();
        return res.status(201).json({ message: 'Turno creado exitosamente', data: turn });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
///read all (get /api/turns)
export async function findAll(req, res) {
    try {
        const em = orm.em.fork();
        const turns = await em.find(Turn, {}, { populate: ['computer', 'client', 'pays'] });
        return res.json({ data: turns });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
///read one (get /api/turns/:id)
export async function findOne(req, res) {
    try {
        const em = orm.em.fork();
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID del turno debe ser un número válido.' });
        }
        const turn = await em.findOne(Turn, { id }, { populate: ['computer', 'client', 'pays'] });
        if (!turn) {
            return res.status(404).json({ message: 'Turno no encontrado.' });
        }
        return res.status(200).json({ data: turn });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
/// update (patch /api/turns/:id)
export async function updateTurn(req, res) {
    try {
        const em = orm.em.fork();
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID del turno debe ser un número válido.' });
        }
        const turn = await em.findOne(Turn, { id }, { populate: ['computer', 'client', 'pays'] });
        if (!turn) {
            return res.status(404).json({ message: 'Turno no encontrado.' });
        }
        const input = req.body.sanitizedInput;
        if (input.status !== undefined)
            turn.status = input.status;
        if (input.extraPrice !== undefined)
            turn.extraPrice = Number(input.extraPrice);
        if (input.duration !== undefined)
            turn.duration = Number(input.duration);
        if (input.startTime !== undefined)
            turn.startTime = new Date(input.startTime);
        if (input.endTime !== undefined)
            turn.endTime = new Date(input.endTime);
        await em.flush();
        return res.status(200).json({ message: 'Turno actualizado exitosamente', data: turn });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
/// delete (delete /api/turns/:id)
export async function removeTurn(req, res) {
    try {
        const em = orm.em.fork();
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID del turno debe ser un número válido.' });
        }
        const turn = await em.findOne(Turn, { id });
        if (!turn) {
            return res.status(404).json({ message: 'Turno no encontrado.' });
        }
        await em.remove(turn);
        await em.flush();
        return res.status(200).json({ message: 'Turno eliminado exitosamente' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//# sourceMappingURL=turn.controller.js.map


//Pay: Controlar Pago, no hace falta hacer todo el crud.
//Un turno puede tener varios pagos, pero un pago solo puede estar asociado a un turno.
//Por lo tanto solo crearemos un endpoint para crear un pago y otro para obtener todos los pagos de un turno.

import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { Turn } from './turn.entity.js';
import { Pay, PaymentStatus } from './pay.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

export function sanitizePayInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    idTurn: req.body.idTurn,
    amount: req.body.amount,
    status: req.body.status,
    fecha: req.body.fecha,
    method: req.body.method,
    newStatus: req.body.newStatus, // Para endpoints de cambio de estado
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}


// 1. CREATE PAY (POST /api/pays)
// ============================================================================
export async function createPay(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const input = req.body.sanitizedInput;

    if (!input.idTurn || input.amount === undefined || !input.method) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios: idTurn, amount y method son requeridos.',
      });
    }

    const turnId = Number(input.idTurn);
    if (isNaN(turnId)) {
      return res.status(400).json({ message: 'El idTurn debe ser numérico.' });
    }

    // Buscamos el turno para validar su existencia y poder modificarlo
    const turn = await em.findOne(Turn, { id: turnId });
    if (!turn) {
      return res.status(404).json({ message: `El turno #${turnId} no existe.` });
    }

    // Generar transactionId único con fecha del día: ej. "PAY-20261004-7F2A"
    const fechaHoy = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
    const uniqueCode = `PAY-${fechaHoy}-${randomHex}`;

    const initialStatus: PaymentStatus = input.status ?? 'PENDIENTE';

    const pay = em.create(Pay, {
      amount: Number(input.amount),
      status: initialStatus,
      date: input.fecha ? new Date(input.fecha) : new Date(),
      method: input.method,
      transactionId: uniqueCode,
      turn,
    });

    // 🔹 Si el pago entra directamente como PAGADO, actualizamos el Turn a RESERVADO
    if (initialStatus === 'PAGADO') {
      turn.status = 'RESERVADO';
    }

    await em.flush();

    return res.status(201).json({
      message: 'Pago registrado exitosamente',
      data: pay,
      turnStatus: turn.status,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

// ============================================================================
// 2. CAMBIO DE ESTADO Y SINCRONIZACIÓN CON TURN (PATCH /api/pays/:id/status)
// ============================================================================
export async function updatePaymentStatus(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const payId = Number(req.params.id);
    const { newStatus } = req.body.sanitizedInput as { newStatus: PaymentStatus };

    if (isNaN(payId)) {
      return res.status(400).json({ message: 'El ID de pago debe ser numérico.' });
    }

    const validStatuses: PaymentStatus[] = [
      'PENDIENTE', 'EN_PROCESO', 'PAGADO', 'RECHAZADO', 'CANCELADO', 'REEMBOLSADO'
    ];

    if (!newStatus || !validStatuses.includes(newStatus)) {
      return res.status(400).json({
        message: `Estado no válido. Opciones permitidas: ${validStatuses.join(', ')}`,
      });
    }

    // Buscamos el pago trayendo la entidad Turn asociada
    const pay = await em.findOne(Pay, { id: payId }, { populate: ['turn'] });
    if (!pay) {
      return res.status(404).json({ message: 'Pago no encontrado.' });
    }

    // Actualizamos el pago
    pay.status = newStatus;

    // 🔹 Modificación directa sobre el Turno según la máquina de estados
    if (newStatus === 'PAGADO') {
      pay.turn.status = 'RESERVADO';
    } else if (newStatus === 'CANCELADO' || newStatus === 'REEMBOLSADO') {
      pay.turn.status = 'CANCELADO';
    } else if (newStatus === 'RECHAZADO') {
      // Si el pago falla, el turno se mantiene en PENDIENTE a la espera de reintento
      pay.turn.status = 'PENDIENTE';
    }

    // em.flush() persiste el cambio tanto en la tabla 'pay' como en 'turn'
    await em.flush();

    return res.status(200).json({
      message: `Pago actualizado a ${newStatus}`,
      data: {
        payId: pay.id,
        transactionId: pay.transactionId,
        paymentStatus: pay.status,
        turnId: pay.turn.id,
        turnStatus: pay.turn.status,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

// ============================================================================
// 3. READ ALL (GET /api/pays)
// ============================================================================
export async function findAll(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const pays = await em.find(Pay, {}, { populate: ['turn'] });
    return res.status(200).json({ data: pays });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

// ============================================================================
// 4. READ ONE (GET /api/pays/:id)
// ============================================================================
export async function findOne(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser numérico.' });
    }

    const pay = await em.findOne(Pay, { id }, { populate: ['turn'] });
    if (!pay) {
      return res.status(404).json({ message: 'Pago no encontrado.' });
    }

    return res.status(200).json({ data: pay });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
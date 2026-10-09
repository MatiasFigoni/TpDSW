import { Request, Response, NextFunction } from 'express';

export function validateId(req: Request, res: Response, next: NextFunction) {
  const id = Number.parseInt(req.params.id);
  
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'El ID proporcionado no es válido. Debe ser un número.' });
  }
  
  next();
}
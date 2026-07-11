import { Computer } from './computer.entity.js';
import { Request, Response, NextFunction } from 'express';
import { ComputerRepository } from './computer.repository.js';
//hacer el CRUD de la entidad computer

const repository = new ComputerRepository();

// function sanitizeComputerData(data: any): Computer | null {

function findAll(req: Request, res: Response){
  res.json(repository.findAll());
}

function findOne(req: Request, res: Response){
  const id = req.params.id
  const computer = repository.findOne({ id })
  if (computer) {
    res.json(computer);
  } else {
    res.status(404).json({ message: 'Computer not found' });
  }
}
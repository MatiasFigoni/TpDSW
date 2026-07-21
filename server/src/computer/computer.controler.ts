import { Request, Response, NextFunction } from 'express';
import { ComputerRepository } from './computer.repository.js';
import { Computer } from './computer.entity.js';

const repository = new ComputerRepository();
    {}
function sanitizeComputerData(req: Request, res: Response, next: NextFunction){
  req.body.sanitizedInput = {
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
    pcNumber: req.body.pcNumber}
  
  Object.keys(req.body.sanitizedInput).forEach(key => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  })
  next();
}

async function findAll(req: Request, res: Response){
  res.json( { data: await repository.findAll()});
}

async function findOne(req: Request, res: Response){
  const id = req.params.id
  const computer = await repository.findOne({ id })
  if (!computer) {
    return res.status(404).send({ message: 'Computer not found' });
  }
  res.json({ data: computer });
}

async function add(req: Request, res: Response){
  const input = req.body.sanitizedInput
  
  const ComputerInput = new Computer(
    input.category,
    input.description,
    input.price,
    input.pcNumber,
  )

  const computer = await repository.add(ComputerInput)
  return res.status(201).send({ message: 'Computer created successfully', data: computer });
  
}

async function update(req: Request, res: Response){
  const computer = await repository.update(req.params.id, req.body.sanitizedInput)

  if (!computer) {
    return res.status(404).send({ message: 'Computer not found' });
  }
  return res.status(200).send({ message: 'Computer updated successfully', data: computer });
}

async function remove(req: Request, res: Response){
  const id = req.params.id
  const computer = await repository.delete({ id })
  if (!computer) {
    return res.status(404).send({ message: 'Computer not found' });
  } else {res.status(200).send({ message: 'Computer deleted successfully' })};
}



export { sanitizeComputerData, findAll, findOne, add, update, remove }
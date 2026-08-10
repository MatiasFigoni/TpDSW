import { Request, Response, NextFunction } from 'express';
import { Computer } from './computer.entity.js';
import { orm } from '../shared/db/orm.js';
import { computerRouter } from './computer.routes.js';

//Realizar CRUD de Computadoras.
//Realizar cambio de estado de computadoras (disponible/no disponible) con un endpoint específico para ello.
//Pasar todo a sql
// maintenance: req.body.maintenance, 

const em = orm.em

function sanitizeComputerData(req: Request, res: Response, next: NextFunction){
  req.body.sanitizedInput = {
    category: req.body.category,
    pcNumber: req.body.pcNumber,
    description: req.body.description,
    status: req.body.status
  }
    
  
  Object.keys(req.body.sanitizedInput).forEach(key => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  })
  next();
}

async function findAll(req: Request, res: Response){
  try {
    const computer = await em.find(
      Computer,
      {},
      // { populate: ['category', 'maintenance']}
      { populate: ['category']}

    )
    if (computer.length===0)
      return res.status(404).json({
        message:'the computer database is empty.',
        data: [],
      })
    res.json( { message: 'found all computers', data:computer});
  } catch (error:any) {
    res.status(500).json({message: error.mesage})
  }
}

async function findOne(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    const computer = await em.findOneOrFail(
      Computer,
      {id},
      { populate: ['category', 'maintenance']}
      
    )
    res.status(200).json({ message: 'found computer', data:computer})

  } catch (error:any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const computer = em.create(Computer, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Computer created', data: computer })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const computerToUpdate = await em.findOneOrFail(Computer, { id })
    em.assign(computerToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'Computer updated', data: computerToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const computer = em.getReference(Computer, id)
    await em.remove(computer)
    await em.flush()
    res.status(200).json({ message: 'Computer removed' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeComputerData, findAll, findOne, add, update, remove }
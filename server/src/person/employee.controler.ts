import { NextFunction, Request, Response} from 'express'
import { orm } from '../shared/db/orm.js'
import { Employee } from './employee.entity.js'
// import jwt from 'jsonwebtoken'
// import {t} from '@mikro-orm/core'

const em = orm.em

function sanitizeEmployeeData(req: Request, res: Response, next: NextFunction){
  req.body.sanitizedInput = {
    name: req.body.name,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    dni: req.body.dni,

    username: req.body.username,
    password: req.body.password
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
    const employee = await em.find(Employee, {});
    res.status(200).json({message: 'found all employee', data:employee});    
  } catch (error:any) {
    res.status(500).json ({message: error.message})
  }
}

async function findOne(req: Request, res: Response){
  try {
    const id = Number.parseInt(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }
    const employee = await em.findOneOrFail(
      Employee,
      {id}

    )
    res.status(200).json({ message: 'found employee', data:employee})

  } catch (error:any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {

      const { name, email, password } = req.body.sanitizedInput || {};
      
    
      
        if (!name || !email || !password) {
        return res.status(400).json({ 
          message: 'Missing required fields: name, email, and password are required.' 
                });
              }
        
        
        const existingEmployee = await em.findOne(Employee, { email });
        if (existingEmployee) {
          return res.status(400).json({ 
            message: 'We are afraid there is already a member with that email.' 
          });
           }

    const employee = em.create(Employee, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'New Employee created', data: employee })
    } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }
    const employeeToUpdate = await em.findOneOrFail(Employee, { id })
    
    const inputData = req.body.sanitizedInput;
    if (!inputData || Object.keys(inputData).length === 0) {
      return res.status(400).json({ 
        message: 'No valid fields provided for update.' 
      });
    }
    
    em.assign(employeeToUpdate, req.body.sanitizedInput)
    await em.flush()
    
    res.status(200).json({ message: 'Employee updated', data: employeeToUpdate })
  } catch (error: any) {
    
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }
    const employee = em.getReference(Employee, id)
    await em.remove(employee)
    await em.flush()
    res.status(200).json({ message: 'employee removed' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function validateEmailAndPassword (req:Request, res:Response) {
  try {
 const email= (req.body.sanitizedLogin.email) as string
  const password =  (req.body.sanitizedLogin.password) as string
   const user = await em.findOne(Employee, {email, password} ) 
   
   if (user) {
    const payload = {
      sub:user.id,
      email: user.email,
      role: user.role  };
    // const secret = process.env.JWT_SECRET  || 'SuperTemporal_EmployeeWachin'
    // const token = jwt.sign(payload, secret, {expiresIn: '2h'})
    
    return res.status(200).json({
      message: 'Welcome Back Partner',
      // token: token,
      data : {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: true

      }
     });
    }
   else{
    return res.status(404).json({message: 'there was not partner found with the credentials that were inputeds'})
   }

    }
    catch (error:any) {return res.status(500).json({message: 'Internal error we are sorry'})}
}


export { sanitizeEmployeeData, findAll, findOne, add, update, remove, validateEmailAndPassword }
import 'reflect-metadata'
import express from 'express'
import { computerRouter } from './computer/computer.routes.js'
import { MaintenanceRouter } from './computer/maintenance.routes.js'
import { CategoryRouter } from './computer/category.routes.js'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { employeeRouter } from './person/employee.routes.js'
import { clientRouter } from './person/client.routes.js'

const app = express()
app.use(express.json())

//luego de los middlewares base.
app.use((req, res, next)=>{
  RequestContext.create(orm.em, next)
})
//antes de las rutas de middlewares de negocio. Faltan cosas
app.use('/api/computers', computerRouter)
app.use('/api/computer/categories', CategoryRouter)
app.use('/api/computer/maintenance', MaintenanceRouter)
app.use('/api/employees', employeeRouter)
app.use('/api/clients', clientRouter)

// app.use('/api/person', personRouter)



app.use((_, res)=>{
  return res.status(404).send({message:'Route not found'})
})

await syncSchema()//never in production.

app.listen(3000,()=>{
  console.log('Server running on http://localhost:3000/')
})


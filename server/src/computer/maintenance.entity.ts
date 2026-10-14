import {
  Entity,
  Property,
  ManyToOne,
  Rel,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Computer } from './computer.entity.js'

@Entity()
export class Maintenance extends BaseEntity {
  
  @Property ({ nullable:false})
  description!:string
  
  @Property ({type: 'date', nullable:true})
  end_date!:Date
  
  @Property ({type: 'date', nullable:true})
  start_date!:Date
  
  @Property ({nullable:false})
  status!:string

  @ManyToOne (()=>Computer,{nullable:false})
  computer!: Rel<Computer>
}
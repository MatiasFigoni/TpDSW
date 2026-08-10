import {
  Entity,
  Property,
  OneToMany,
  Collection,
  Cascade

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

  @OneToMany(() => Computer, (computer) => computer.maintenance, {
    cascade: [Cascade.ALL],
  })
  computers = new Collection<Computer>(this)
}
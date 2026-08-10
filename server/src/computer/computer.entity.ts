import {
  Entity,
  Property,
  ManyToOne,
  Rel,
  

} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Category } from './category.entity.js'
import { Maintenance } from './maintenance.entity.js'

@Entity()
export class Computer extends BaseEntity {

  @ManyToOne(() => Category, { nullable: false })
  category!: Rel<Category>
  
  @Property ({nullable:false})
  status!:string
  
  @Property ({nullable:false})
  description!:string
  
  @Property ({nullable:false})
  pcNumber!:number
  
  @ManyToOne(() => Maintenance, { nullable: false })
  maintenance!: Rel<Maintenance>
  
}
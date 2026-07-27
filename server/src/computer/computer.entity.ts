import {
  Entity,
  Property

  // ManyToMany,
  // Cascade,
  // ManyToOne,
  // Rel,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Computer extends BaseEntity {

  @Property({nullable:false})
  category!:string

  @Property ({nullable:false})
  status!:boolean

  @Property ({nullable:false})
  description!:string

  @Property ({nullable:false})
  price!:number
  
  @Property ({nullable:false})
  pcNumber!:number

}
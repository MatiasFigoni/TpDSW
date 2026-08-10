import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Computer } from './computer.entity.js'


@Entity()
export class Category extends BaseEntity {

  @Property ({nullable:false})
  description!:string
  
  @Property ({nullable:false})
  price!:number

  @OneToMany(() => Computer, (computer) => computer.category,{
     cascade: [Cascade.ALL],
  })
  computers = new Collection<Computer>(this)
}
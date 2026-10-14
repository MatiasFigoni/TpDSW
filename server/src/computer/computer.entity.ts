import {
  Entity,
  Property,
  ManyToOne,
  Collection,
  Rel,
  OneToMany,
  Cascade,

} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Category } from '../category/category.entity.js';
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
  
  @OneToMany(()=>Maintenance,(m)=> m.computer, {cascade: [Cascade.ALL]})
  maintenance = new Collection<Maintenance>(this)
}
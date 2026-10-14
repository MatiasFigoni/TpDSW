import { Entity, Property, OneToMany, Collection, Cascade} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Person } from './person.entity.js';
import { Turn } from '../services/turn.entity.js';

@Entity()
export class Client extends Person {
  @Property()
  status: boolean = true;

  @Property({ persist:false })
  get role():string{
    return 'client';
  }

  @OneToMany(() => Turn, (turn) => turn.client, { cascade: [Cascade.ALL] })
    turns = new Collection<Turn>(this);

  }

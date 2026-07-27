import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Person } from './person.entity.js';

@Entity()
export class Client extends Person {
  @Property()
  status: boolean = true;
}
import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Person } from './person.entity.js';

@Entity()
export class Employee extends Person{
  @Property()
  username!: string;

  @Property()
  password!: string;

}
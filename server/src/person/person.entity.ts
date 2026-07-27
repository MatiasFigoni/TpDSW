import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity({ abstract: true })
export abstract class Person extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  lastName!: string;

  @Property()
  phoneNumber!: string;

  @Property()
  email!: string;

  @Property()
  dni!: string;
}
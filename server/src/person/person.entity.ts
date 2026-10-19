import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity({ abstract: true })
export abstract class Person extends BaseEntity {
  @Property({nullable: true})
  name!: string;

  @Property({nullable: true})
  lastName!: string;

  @Property({nullable: true})
  phoneNumber!: string;

  @Property()
  email!: string;

  @Property({nullable: true})
  dni!: string;

  @Property({nullable: true})
  username!: string;

  @Property()
  password!: string;
}
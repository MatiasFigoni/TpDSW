import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export abstract class Person extends BaseEntity {
  @Property({ fieldName: 'name' }) 
  private _name!: string;

  @Property({ fieldName: 'last_name' })
  private _lastName!: string;

  @Property({ fieldName: 'phone_number' })
  private _phoneNumber!: string;

  @Property({ fieldName: 'email' })
  private _email!: string;

  @Property({ fieldName: 'dni' })
  private _dni!: string;

  // Getters y Setters
  public get name(): string { return this._name; }
  public set name(value: string) { this._name = value; }

  public get lastName(): string { return this._lastName; }
  public set lastName(value: string) { this._lastName = value; }

  public get phoneNumber(): string { return this._phoneNumber; }
  public set phoneNumber(value: string) { this._phoneNumber = value; }

  public get email(): string { return this._email; }
  public set email(value: string) { this._email = value; }

  public get dni(): string { return this._dni; }
  public set dni(value: string) { this._dni = value; }
}
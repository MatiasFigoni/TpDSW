import { Entity, Property, OneToMany,Collection,Cascade,ManyToOne,Rel,ManyToMany} from '@mikro-orm/core';
import { Pay } from '../services/pay.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Client } from '../person/client.entity.js';
import { Computer } from '../computer/computer.entity.js';
@Entity()
export class Turn extends BaseEntity {
  @Property({type: 'datetime' , nullable:false})
  dateTime!: Date;
  @Property({type: 'datetime' , nullable:false})
  startTime!: Date;
  @Property({type: 'datetime' , nullable:false})
  endTime!: Date;
  @Property({nullable:false, default: 1})
  duration!: number;
  @Property({nullable:false, default: 0})
  extraPrice!: number;
  @Property({nullable:false})
  status!: string; //PENDIENTE | RESERVADO | FINALIZADO | CANCELADO.
  
  @ManyToOne(() => Computer, { nullable: false })
    computer!: Rel<Computer>;
  
  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Client>;

  @OneToMany(() => Pay, (pay: Pay) => pay.turn, {cascade:[Cascade.ALL]})
  pays= new Collection<Pay>(this);
}
import { Entity, Property, ManyToOne,Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Turn } from './turn.entity.js';

export type PaymentStatus = 
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'PAGADO'
  | 'RECHAZADO'
  | 'CANCELADO'
  | 'REEMBOLSADO';

@Entity()
export class Pay extends BaseEntity {
  @Property()
  amount!: number;
  @Property()
  status?: PaymentStatus = 'PENDIENTE';
  @Property({type: 'datetime' , nullable:false})
  date!: Date;
  @Property()
  method!: string; //efectivo|tarjeta|transferencia
  @Property({nullable:false, unique: true})
  transactionId!: string;
  @ManyToOne(() => Turn, { nullable: false })
  turn!: Rel<Turn>;
}

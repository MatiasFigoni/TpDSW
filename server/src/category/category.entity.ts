
import { Entity, Property, OneToMany, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Computer } from '../computer/computer.entity.js';

@Entity()
export class Category extends BaseEntity {
    
    @Property({ nullable: false })
    description!: string;

    @Property({ nullable: false })
    hourly_price!: number;


    @OneToMany(() => Computer, (computer: Computer) => computer.category, {
        cascade: [Cascade.ALL],
    })
    computers = new Collection<Computer>(this);
}

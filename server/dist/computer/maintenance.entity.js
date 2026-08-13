var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Computer } from './computer.entity.js';
export let Maintenance = class Maintenance extends BaseEntity {
    constructor() {
        super(...arguments);
        this.computers = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Maintenance.prototype, "description", void 0);
__decorate([
    Property({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Maintenance.prototype, "end_date", void 0);
__decorate([
    Property({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Maintenance.prototype, "start_date", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Maintenance.prototype, "status", void 0);
__decorate([
    OneToMany(() => Computer, (computer) => computer.maintenance, {
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Maintenance.prototype, "computers", void 0);
Maintenance = __decorate([
    Entity()
], Maintenance);
//# sourceMappingURL=maintenance.entity.js.map
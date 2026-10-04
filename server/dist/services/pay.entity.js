var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Turn } from './turn.entity.js';
export let Pay = class Pay extends BaseEntity {
    constructor() {
        super(...arguments);
        this.status = 'PENDIENTE';
    }
};
__decorate([
    Property(),
    __metadata("design:type", Number)
], Pay.prototype, "amount", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Pay.prototype, "status", void 0);
__decorate([
    Property({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], Pay.prototype, "date", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Pay.prototype, "method", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Pay.prototype, "transactionId", void 0);
__decorate([
    ManyToOne(() => Turn, { nullable: false }),
    __metadata("design:type", Object)
], Pay.prototype, "turn", void 0);
Pay = __decorate([
    Entity()
], Pay);
//# sourceMappingURL=pay.entity.js.map
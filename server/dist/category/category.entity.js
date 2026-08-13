/*CATEGORY.ENTITY.TS*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, OneToMany, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Computer } from '../computer/computer.entity.js';
export let Category = class Category extends BaseEntity {
    constructor() {
        super(...arguments);
        this.computers = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Category.prototype, "hourly_price", void 0);
__decorate([
    OneToMany(() => Computer, (computer) => computer.category, {
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Category.prototype, "computers", void 0);
Category = __decorate([
    Entity()
], Category);
//# sourceMappingURL=category.entity.js.map
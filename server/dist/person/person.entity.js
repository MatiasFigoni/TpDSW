var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
export let Person = class Person extends BaseEntity {
    // Getters y Setters
    get name() { return this._name; }
    set name(value) { this._name = value; }
    get lastName() { return this._lastName; }
    set lastName(value) { this._lastName = value; }
    get phoneNumber() { return this._phoneNumber; }
    set phoneNumber(value) { this._phoneNumber = value; }
    get email() { return this._email; }
    set email(value) { this._email = value; }
    get dni() { return this._dni; }
    set dni(value) { this._dni = value; }
};
__decorate([
    Property({ fieldName: 'name' }),
    __metadata("design:type", String)
], Person.prototype, "_name", void 0);
__decorate([
    Property({ fieldName: 'last_name' }),
    __metadata("design:type", String)
], Person.prototype, "_lastName", void 0);
__decorate([
    Property({ fieldName: 'phone_number' }),
    __metadata("design:type", String)
], Person.prototype, "_phoneNumber", void 0);
__decorate([
    Property({ fieldName: 'email' }),
    __metadata("design:type", String)
], Person.prototype, "_email", void 0);
__decorate([
    Property({ fieldName: 'dni' }),
    __metadata("design:type", String)
], Person.prototype, "_dni", void 0);
Person = __decorate([
    Entity()
], Person);
//# sourceMappingURL=person.entity.js.map
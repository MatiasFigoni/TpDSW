import { Category } from './category.entity.js';
import { EntityManager } from '@mikro-orm/core';

export class CategoryRepository {
    em: EntityManager;

    constructor(em: EntityManager) {
        this.em = em;
    }

    async findAll(): Promise<Category[]> {
        return await this.em.find(Category, {});
    }

    async findOne(id: number): Promise<Category | null> {
        return await this.em.findOne(Category, { id });
    }

    async add(category: Category): Promise<Category> {
        this.em.persist(category);
        await this.em.flush();
        return category;
    }
                                
    async update(category: Category): Promise<Category> {
        this.em.persist(category);
        await this.em.flush();
        return category;
    }                                       

    async delete(category: Category): Promise<void> {
        this.em.remove(category);
        await this.em.flush();
    }
}
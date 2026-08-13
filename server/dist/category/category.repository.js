import { Category } from './category.entity.js';
export class CategoryRepository {
    constructor(em) {
        this.em = em;
    }
    async findAll() {
        return await this.em.find(Category, {});
    }
    async findOne(id) {
        return await this.em.findOne(Category, { id });
    }
    async add(category) {
        this.em.persist(category);
        await this.em.flush();
        return category;
    }
    async update(category) {
        this.em.persist(category);
        await this.em.flush();
        return category;
    }
    async delete(category) {
        this.em.remove(category);
        await this.em.flush();
    }
}
//# sourceMappingURL=category.repository.js.map
export class CategoryService {
    constructor(repository) {
        this.repository = repository;
    }
    async getAll() {
        const repo = await this.repository.findAll();
        return repo;
    }
    async getOne(id) {
        const repo = await this.repository.findOne(id);
        return repo;
    }
    async add(category) {
        const added = await this.repository.add(category);
        return added;
    }
    async update(category) {
        const updated = await this.repository.update(category);
        return updated;
    }
    async del(category) {
        await this.repository.delete(category);
    }
}
//# sourceMappingURL=category.service.js.map
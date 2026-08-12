import { Category } from './category.entity.js';
import { CategoryRepository } from './category.repository.js';
export class CategoryService {
    repository: CategoryRepository;

    constructor(repository: CategoryRepository) {
        this.repository = repository;
    }

    async getAll(): Promise<Category[]> {
        const repo = await this.repository.findAll();
        return repo; 
    }

    async getOne(id: number): Promise<Category | null> {
        const repo = await this.repository.findOne(id);
        return repo;
    }

    async add(category: Category): Promise<Category> {
        const added = await this.repository.add(category);
        return added;
    }

    async update(category: Category): Promise<Category> {
        const updated = await this.repository.update(category);
        return updated;
    }

    async del(category: Category): Promise<void> {
        await this.repository.delete(category);
    }
}
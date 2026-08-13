export class CategoryController {
    constructor(service) {
        this.service = service;
    }
    async getAll(req, res) {
        try {
            const result = await this.service.getAll();
            res.status(200).json({ message: 'Categorías encontradas', data: result });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
//# sourceMappingURL=category.controller.js.map
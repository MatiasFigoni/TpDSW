import { ComputerRepository } from './computer.repository.js';
import { Computer } from './computer.entity.js';
const repository = new ComputerRepository();
{ }
function sanitizeComputerData(req, res, next) {
    req.body.sanitizedInput = {
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        pcNumber: req.body.pcNumber
    };
    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    res.json({ data: await repository.findAll() });
}
async function findOne(req, res) {
    const id = req.params.id;
    const computer = await repository.findOne({ id });
    if (!computer) {
        return res.status(404).send({ message: 'Computer not found' });
    }
    res.json({ data: computer });
}
async function add(req, res) {
    const input = req.body.sanitizedInput;
    const ComputerInput = new Computer(input.category, input.description, input.price, input.pcNumber);
    const computer = await repository.add(ComputerInput);
    return res.status(201).send({ message: 'Computer created successfully', data: computer });
}
async function update(req, res) {
    const computer = await repository.update(req.params.id, req.body.sanitizedInput);
    if (!computer) {
        return res.status(404).send({ message: 'Computer not found' });
    }
    return res.status(200).send({ message: 'Computer updated successfully', data: computer });
}
async function remove(req, res) {
    const id = req.params.id;
    const computer = await repository.delete({ id });
    if (!computer) {
        return res.status(404).send({ message: 'Computer not found' });
    }
    else {
        res.status(200).send({ message: 'Computer deleted successfully' });
    }
    ;
}
export { sanitizeComputerData, findAll, findOne, add, update, remove };
//# sourceMappingURL=computer.controler.js.map
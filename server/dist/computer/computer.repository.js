import { db } from '../shared/db/conn.js';
import { ObjectId } from 'mongodb';
const computers = db.collection('computers');
export class ComputerRepository {
    async findAll() {
        return await computers.find().toArray();
    }
    async findOne(item) {
        const _id = new ObjectId(item.id);
        return (await computers.findOne({ _id })) || undefined;
    }
    async add(item) {
        item._id = (await computers.insertOne(item)).insertedId;
        return item;
    }
    async update(id, item) {
        const _id = new ObjectId(id);
        return (await computers.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined;
    }
    async delete(item) {
        const _id = new ObjectId(item.id);
        return (await computers.findOneAndDelete({ _id })) || undefined;
    }
}
//# sourceMappingURL=computer.repository.js.map
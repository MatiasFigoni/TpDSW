import { Repository } from '../shared/repository.js';
import { Computer } from './computer.entity.js';
import {db} from '../shared/db/conn.js'
import { ObjectId } from 'mongodb';
const computers= db.collection<Computer>('computers')

export class ComputerRepository implements Repository<Computer> {
  public async findAll(): Promise<Computer[] | undefined> {
    return await computers.find().toArray();
  }

  public async findOne(item: { id: string }): Promise<Computer | undefined> {
    const _id= new ObjectId(item.id)
    return (await computers.findOne({ _id })) || undefined;
  }

  public async add(item: Computer): Promise<Computer | undefined> {
    item._id = (await computers.insertOne(item)).insertedId;
    return item;
  }

  public async update(id: string, item: Computer): Promise<Computer | undefined> {
    const _id = new ObjectId(id);
    return (await computers.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined
  }

  public async delete(item: { id: string }): Promise<Computer | undefined> {
    const _id = new ObjectId(item.id)
    return (await computers.findOneAndDelete({ _id })) || undefined;  
  }

}

import { Repository } from '../shared/repository.js';
import { Computer } from './computer.entity.js';

const computer=[
  new Computer('Gaming','PC de alto rendimiento',1500,1),
]

export class ComputerRepository implements Repository<Computer> {
  public findAll(): Computer[] | undefined {
    return computer;
  }

  public findOne(item: { id: string }): Computer | undefined {
    return computer.find((computer) => computer.id === item.id);
  }

  public add(item: Computer): Computer | undefined {
    computer.push(item);
    return item;
  }

  public update(item: Computer): Computer | undefined {
    const index = computer.findIndex((computer) => computer.id === item.id);
    if (index !== -1) {
      computer[index] = item;
      return item;
    }
    return undefined;
  }

  public delete(item: { id: string }): Computer | undefined {
    const index = computer.findIndex((computer) => computer.id === item.id);
    if (index !== -1) {
      return computer.splice(index, 1)[0];
    }
    return undefined;
  }

}

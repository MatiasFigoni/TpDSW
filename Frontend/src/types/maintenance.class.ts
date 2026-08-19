export class Maintenance {
    id: number;
    description: string;
    start_date: Date;
    end_date: Date;
    status: string;
    constructor(id: number, description: string, start_date: Date, end_date: Date, status: string,) {
        this.id = id;
        this.description = description;
        this.start_date = start_date;
        this.end_date = end_date;
        this.status = status;
    }
}1
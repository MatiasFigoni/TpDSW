export class Category{
    id:number;
    description:string;
    hourly_price:number;
    constructor(id:number,description:string,hourly_price:number){
        this.id = id;
        this.description = description;
        this.hourly_price = hourly_price;
    }
}
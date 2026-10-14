export class Category{
    id:number;
    name:string;
    description:string;
    hourly_price:number;
    constructor(id:number,name:string,description:string,hourly_price:number){
        this.id = id;
        this.name = name;
        this.description = description;
        this.hourly_price = hourly_price;
    }
}
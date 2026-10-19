export class Person {
    id: number;
    name: string;
    lastname?: string;
    phoneNumber?: string;
    dni?: string;
    email: string;
    username?: string;
    role: string;
    status?:boolean;

    constructor(person: {
        id: number;
        name: string;
        email: string;
        role: string;
        lastname?: string;
        phoneNumber?: string;
        dni?: string;
        username?: string;
        status?:boolean;
    }) {
        this.id = person.id;
        this.name = person.name;
        this.email = person.email;
        this.role = person.role;
        this.lastname = person.lastname;
        this.phoneNumber = person.phoneNumber;
        this.dni = person.dni;
        this.username = person.username;
        this.status = person.status
    }
}
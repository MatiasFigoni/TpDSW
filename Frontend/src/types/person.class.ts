export class Person {
    id: number;
    name: string;
    lastname?: string;
    phoneNumber?: string;
    dni?: string;
    email: string;
    username?: string;
    isAdmin: boolean;
    role: string;

    constructor(person: {
        id: number;
        name: string;
        email: string;
        isAdmin: boolean;
        role: string;
        lastname?: string;
        phoneNumber?: string;
        dni?: string;
        username?: string;
    }) {
        this.id = person.id;
        this.name = person.name;
        this.email = person.email;
        this.isAdmin = person.isAdmin;
        this.role = person.role;
        this.lastname = person.lastname;
        this.phoneNumber = person.phoneNumber;
        this.dni = person.dni;
        this.username = person.username;
    }
}
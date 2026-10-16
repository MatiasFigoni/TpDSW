import { Person } from "../types/person.class.ts";
import { api } from "./api.ts";

export type AccountType = 'client' | 'employee'

interface LoginResponse{
    message:string;
    data: Person;
}

export async function login(accountType: AccountType,credentials: {email:string, password:string}):Promise<Person>{
    const endpoint = accountType === 'client'? 
    '/api/clients/login': '/api/employees/login';
    const response = await api(endpoint,{
        method:'POST',
        body: JSON.stringify(credentials),
    });
    if(!response.ok){
        throw new Error('No se pudo iniciar sesion');
    }
    const result:LoginResponse = await response.json();
    return new Person({
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        isAdmin:result.data.isAdmin,
        role:result.data.role,
    })
    
}

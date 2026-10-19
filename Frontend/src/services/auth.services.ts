import { Person } from "../types/person.class.ts";
import { api } from "./api.ts";

export type AccountType = 'client' | 'employee'

export interface ClientRegistration {
    email: string;
    password: string;
    status:boolean;
}

interface LoginResponse{
    message:string;
    data: Person;
}

export async function registerClient(client: ClientRegistration): Promise<void> {
    const response = await api('/api/clients', {
        method: 'POST',
        body: JSON.stringify({...client, status: true}),
    });
    if (!response.ok) {
        if(response.status === 400){
            throw new Error('El email ya esta registrado, utilice otro o recupere la contraseña.')
        }
        throw new Error('No se pudo registrar el usuario. Verificá los datos e intentá nuevamente.');
    }
    
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
        role:result.data.role,
    })
    
}

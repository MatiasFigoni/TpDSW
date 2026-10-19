import { api } from "./api.ts";
import { Computer, type CreateComputer } from "../types/computer.class.ts";

export async function fetchComputers(categoryId?: string): Promise<Computer[]> {
  const url = categoryId ? `/api/computers/category/${categoryId}` : `/api/computers/`;
  const response = await api(url);
  if(response.status === 404) {
    throw new Error('No hay computadoras registradas'); 
  }
  if (!response.ok) throw new Error('Error en la peticion de computadoras');
  const result = await response.json();
  return result.data;
};

export async function fetchComputerNumberLatestMaintenance(pcNumber:string):Promise<Computer>{
  const url = `/api/computers/${pcNumber}/maintenance/latest`;
  const response = await api(url);
  if(!response.ok) throw new Error('Error en la peticion de computadoras');
  const result = await response.json();
  return result.data;
}

export async function createComputer(computer:CreateComputer,role:string):Promise<Computer> {
  const response = await api(`/api/computers`,{
    method: 'POST',
    body: JSON.stringify(computer)
  },role)
  if(!response.ok) throw new Error('Error al crear la computadora');
  const result = await response.json();
  return result.data;
}

export async function updateComputer(computer: Computer,role:string): Promise<Computer> {
  const response = await api(`/api/computers/${computer.pcNumber}`, {
    method: 'PUT',
    body: JSON.stringify(computer),
  },role);
  if (!response.ok) throw new Error('Error al actualizar la computadora');
  const result = await response.json();
  return result.data;
}

export async function deleteComputer(pcNumber:string,role:string):Promise<{message:string}> {
  const response = await api(`/api/computers/${pcNumber}`, {
    method: 'DELETE'
  },role);
  if(!response.ok) throw new Error('Error al eliminar la computadora');
  const result = await response.json();
  return result.data;
}
import { api } from "./api.ts";

export async function fetchComputers(){
  const response = await api('/api/computers');
  if(!response.ok) throw new Error('Error en la peticion');
  return response.json();
}
import { api } from "./api.ts";
import { Computer } from "../types/computer.class.ts";

export async function fetchComputers(categoryId?: string): Promise<Computer[]> {
  const url = categoryId ? `/api/computers/category/${categoryId}` : `/api/computers/`;
  const response = await api(url);
  if (!response.ok) throw new Error('Error en la peticion de computadoras');
  const result = await response.json();
  return result.data;
}
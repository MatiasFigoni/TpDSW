import { api } from "./api.ts";
import { Computer } from "../types/computer.class.ts";

export async function fetchComputers(): Promise<Computer[]> {
  const response = await api('/api/computers');
  if (!response.ok) throw new Error('Error en la peticion');
  const result = await response.json();
  return result.data;
}
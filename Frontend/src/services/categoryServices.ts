import { api } from "./api.ts";
import type { Category } from "../types/category.class.ts";

export async function fetchCategory( id:string = ''): Promise<Category[]> {
    const response = await api(`/api/categories/` + id);
    if (!response.ok) throw new Error('Error en la peticion de categoria');
    const result = await response.json();
    return result.data;
}
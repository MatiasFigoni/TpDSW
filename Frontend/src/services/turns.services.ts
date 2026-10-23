import type { Computer } from "../types/computer.class.ts";
import { formatDateForInput } from "../utils/formatDateForInput.ts";
import { api } from "./api.ts";

export async function fetchAviableComputers(date:Date, hour:string, categoryId?:string): Promise<Computer[]>{
    const url = categoryId ? `/api/turns/available-computers?date=${formatDateForInput(date)}&hour=${hour}&categoryId=${categoryId}`
    : `/api/turns/available-computers?date=${formatDateForInput(date)}&hour=${hour}`;
    const response = await api(url);
    if (!response.ok) throw Error('No hay computadoras disponible');
    const result = await response.json();
    return result.data;
}
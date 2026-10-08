import { api } from "./api.ts";
import type { Maintenance } from "../types/maintenance.class.ts";

export async function createMaintenance(maintenance:Maintenance): Promise<Maintenance> {
    const response = await api('/api/computer/maintenance',{
        method: 'POST',
        body: JSON.stringify(maintenance),
    });
    if (!response.ok) throw new Error('Error en crear el mantenimiento');
    const result = await response.json();
    return result.data;
}
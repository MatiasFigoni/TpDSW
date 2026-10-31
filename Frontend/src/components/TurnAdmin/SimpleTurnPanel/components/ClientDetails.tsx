import { Mail, Phone, User } from "lucide-react";
import type { Turn } from "../../../../types/turn.type.ts";

function ClientDetails({ turn }: { turn: Turn }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" /> Datos del Cliente
            </span>
            <p className="text-zinc-200">
                <strong className="text-zinc-400">Nombre:</strong> {turn.client.name} {turn.client.lastName ?? ''}
            </p>
            <p className="text-zinc-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" /> {turn.client.email}
            </p>
            {turn.client.phoneNumber ? (
                <p className="text-zinc-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" /> {turn.client.phoneNumber}
                </p>
            ) : (
                <p className="text-zinc-500 italic">Sin teléfono registrado</p>
            )}
            {turn.client.dni && (
                <p className="text-zinc-200">
                    <strong className="text-zinc-400">DNI:</strong> {turn.client.dni}
                </p>
            )}
        </div>
    )
}
export default ClientDetails;
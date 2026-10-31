import { Monitor } from "lucide-react";
import type { Turn } from "../../../../types/turn.type.ts";
import { formatHour, toLocalDateKey } from "../../../../utils/reservationDates.ts";
interface TurnDetailsProps {
    turn: Turn;
    hourlyPrice: number;
    totalPrice: number;
}

function TurnDetails({ turn, hourlyPrice, totalPrice }: TurnDetailsProps) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase font-bold  mb-1 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-blue-400" /> Detalle de la Estación
            </span>
            <p className="text-zinc-200">
                <strong className="text-zinc-400">Turno ID:</strong> #{turn.id}
            </p>
            
            <p className="text-zinc-200">
                <strong className="text-zinc-400">Fecha:</strong> {toLocalDateKey(new Date(turn.startTime))}
            </p>
            <p className="text-zinc-200">
                <strong className="text-zinc-400">Hora Inicio:</strong> {formatHour(new Date(turn.startTime).getHours())}
            </p>
            <p className="text-zinc-200">
                <strong className="text-zinc-400">Hora Fin:</strong> {formatHour(new Date(turn.endTime).getHours())}
            </p>
            <p className="text-zinc-200">
                <strong className="text-zinc-400">Categoría:</strong> {turn.computer?.category?.name ?? 'General'}
            </p>
            <p className="text-zinc-200">
                <strong className="text-zinc-400">Tarifa / hora:</strong> ${hourlyPrice > 0 ? hourlyPrice.toLocaleString('es-AR') : '0'}
            </p>
            <p className="text-blue-400 font-bold">
                Total Turno: ${totalPrice > 0 ? totalPrice.toLocaleString('es-AR') : '0'}
            </p>
        </div>
    );
}
export default TurnDetails;
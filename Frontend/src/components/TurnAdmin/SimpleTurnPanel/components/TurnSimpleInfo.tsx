import { AlertTriangle, Banknote, Clock, CreditCard, Dot, User } from "lucide-react";
import type { Turn } from "../../../../types/turn.type.ts";
import { formatHour } from "../../../../utils/reservationDates.ts";
interface PcInfoProps {
    isOlderThanOneDay: boolean;
    turn: Turn;
    isExpanded: boolean;
    setExpandedId: (id: number | null) => void;
    totalPrice: number;
}

function PcInfo({ turn, isExpanded, setExpandedId, totalPrice, isOlderThanOneDay }: PcInfoProps) {
    const paymentMethod = () => {
        const hasPendingPay = turn.pays?.some((p) => p.status === 'PENDIENTE');
        const hasPaidPay = turn.pays?.some((p) => p.status === 'PAGADO');
        const isCash = turn.pays?.some((p) => p.method === 'efectivo') || turn.status === 'PENDIENTE';

        if (hasPendingPay || (!hasPaidPay && turn.status === 'PENDIENTE')) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    <Banknote className="w-3 h-3 text-amber-400" />
                    {isCash ? 'Cobro en Mostrador (Efectivo)' : 'Pago Pendiente'}
                </span>
            );
        }
        if (hasPaidPay) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <CreditCard className="w-3 h-3" />
                    Pago Confirmado
                </span>
            );
        }
        return null;
    };

    return (
        <div
            onClick={() => setExpandedId(isExpanded ? null : turn.id)}
            className="flex items-center gap-4 cursor-pointer flex-1" >
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-800 text-center shrink-0">
                <span className="text-xs text-zinc-500 uppercase font-semibold">PC</span>
                <span className="text-xl font-black text-white">#{turn.computer.pcNumber}</span>
            </div>
            <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-bold text-base">
                        {formatHour(new Date(turn.startTime).getHours())} - {formatHour(new Date(turn.endTime).getHours())}
                    </span>
                    <span className="text-xs text-zinc-500">({turn.duration}h)</span>
                    {/* Status badge */}
                    <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${turn.status === 'INICIADO'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : turn.status === 'RESERVADO'
                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                : turn.status === 'PENDIENTE'
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                    : turn.status === 'CANCELADO' || turn.status === 'FINALIZADO' ?
                                        'bg-red-500/10 border-red-500/30 text-red-400' : ''
                            }`}>
                        {turn.status}
                    </span>
                    {isOlderThanOneDay && (
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3 h-3" /> +1 día
                        </span>
                    )}
                </div>
                {/* Client quick info */}
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-semibold text-white">
                        {turn.client.name} {turn.client.lastName ?? ''}
                    </span>
                    <span className="text-xs text-zinc-500">({turn.client.email})</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span>{turn.computer?.category?.name ?? 'General'}</span>
                    <Dot />
                    <span className="text-blue-400 font-bold">
                        ${totalPrice > 0 ? totalPrice.toLocaleString('es-AR') : '0'}
                    </span>
                    {/* Indicador de Pago (Efectivo / Mostrador / Tarjeta) */}
                    {paymentMethod()}
                </div>
            </div>
        </div>
    )
}
export default PcInfo;
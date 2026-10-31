import { AlertTriangle, Banknote, CreditCard, Dot } from "lucide-react";
import type { Turn, TurnStatus } from "../../../../types/turn.type.ts";
import { formatHour, toLocalDateKey } from "../../../../utils/reservationDates.ts";
interface QuickInfoTurnProps {
    turn: Turn;
    isOlderThanOneDay: boolean;
    totalPrice: number;
}
const statusBadge = (status: TurnStatus) => {
    switch (status) {
        case 'INICIADO':
            return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
        case 'RESERVADO':
            return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
        case 'PENDIENTE':
            return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
        case 'FINALIZADO':
            return 'bg-zinc-800 border-zinc-700 text-zinc-400';
        case 'CANCELADO':
            return 'bg-red-500/10 border-red-500/30 text-red-400';
        default:
            return 'bg-zinc-800 text-zinc-400';
    }
};
function QuickInfoTurn({ turn, isOlderThanOneDay, totalPrice }: QuickInfoTurnProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                <span className="text-[10px] text-zinc-500 font-semibold">PC</span>
                <span className="text-lg font-black text-white">#{turn.computer.pcNumber}</span>
            </div>

            <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-white font-semibold text-sm">
                        {turn.client.name} {turn.client.lastName ?? ''}
                    </span>
                    <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusBadge(
                            turn.status
                        )}`}
                    >
                        {turn.status}
                    </span>

                    {isOlderThanOneDay && (
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3 h-3" /> +1 día
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                    <span>{toLocalDateKey(new Date(turn.startTime))} - {formatHour(new Date(turn.startTime).getHours())}</span>
                    <Dot />
                    <span>{turn.duration} hs</span>
                    <Dot />
                    <span>{turn.computer?.category?.name ?? 'General'}</span>
                    <Dot />
                    <span className="text-blue-400 font-bold">
                        ${totalPrice > 0 ? totalPrice.toLocaleString('es-AR') : '0'}
                    </span>
                    {/* Indicador de Pago  */}
                    {(() => {
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
                    })()}
                </div>
            </div>
        </div>
    );
};
export default QuickInfoTurn;
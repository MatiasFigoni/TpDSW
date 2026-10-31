import type { Turn, TurnStatus } from "../../../../types/turn.type.ts";

interface ChangeStatusProps {
    turn: Turn;
    isUpdating: boolean;
    handleStatusChange: (turn: Turn, newStatus: TurnStatus) => void;
}
function ChangeStatus({ turn, isUpdating, handleStatusChange }: ChangeStatusProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/60">
            <span className="text-xs text-zinc-500">Cambiar estado manualmente:</span>
            <div className="flex flex-wrap gap-2">
                {turn.status !== 'INICIADO' && (
                    <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(turn, 'INICIADO')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer disabled:opacity-50"
                    >
                        Marcar INICIADO (Check-in)
                    </button>
                )}
                {turn.status !== 'RESERVADO' && (
                    <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(turn, 'RESERVADO')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer disabled:opacity-50"
                    >
                        Marcar RESERVADO
                    </button>
                )}
                {turn.status !== 'FINALIZADO' && (
                    <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(turn, 'FINALIZADO')}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 cursor-pointer disabled:opacity-50"
                    >
                        Marcar FINALIZADO
                    </button>
                )}
                {turn.status !== 'CANCELADO' && (
                    <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(turn, 'CANCELADO')}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white font-semibold text-xs border border-red-500/30 cursor-pointer disabled:opacity-50"
                    >
                        CANCELAR
                    </button>
                )}
            </div>
        </div>
    )
}
export default ChangeStatus;
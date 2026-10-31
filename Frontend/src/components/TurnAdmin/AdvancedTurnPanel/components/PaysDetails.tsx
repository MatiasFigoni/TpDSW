import { CreditCard } from "lucide-react";
import type { Turn } from "../../../../types/turn.type.ts";
interface PaysDetailsProps {
    turn: Turn;
    updatingPayId: number | null;
    handleMarkPaymentPaid: (payId: number) => void;

}

function PaysDetails({ turn, updatingPayId, handleMarkPaymentPaid }: PaysDetailsProps) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Pagos Registrados
            </span>
            {turn.pays && turn.pays.length > 0 ? (
                turn.pays.map((pay) => (
                    <div key={pay.id} className="border-b border-zinc-800 last:border-0 pb-1.5">
                        <span className={pay.status === 'PAGADO' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                            {pay.status === 'PENDIENTE' ? 'PENDIENTE DE PAGO' : pay.status}
                        </span>
                        <div className="flex items-center justify-between">
                            <p className="text-zinc-200 font-semibold">${pay.amount} ({pay.method})</p>
                            {pay.status === 'PENDIENTE' && (
                                <button
                                    disabled={updatingPayId === pay.id}
                                    onClick={() => handleMarkPaymentPaid(pay.id)}
                                    className="px-2 py-2 text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-white rounded cursor-pointer disabled:opacity-50"
                                >
                                    {updatingPayId === pay.id ? 'Registrando...' : 'Marcar Pagado'}
                                </button>
                            )}
                        </div>
                        <p className="text-zinc-500 text-[10px]">
                            Tx: {pay.transactionId}
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-zinc-500 italic">Sin pagos registrados aún (Cobro en mostrador)</p>
            )}
        </div>
    )
}
export default PaysDetails;
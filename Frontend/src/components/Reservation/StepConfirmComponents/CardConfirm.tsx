import { CheckCircle2, Receipt } from "lucide-react";
import { Link } from "react-router";
import type { ReservationDraft } from "../../../types/reservation.types";
import { formatHour, formatLongDate, formatPrice } from "../../../utils/reservationDates";
import type { Person } from "../../../types/person.class";
import type { PaymentInfo } from "../../../types/pay.type";

interface PropsCardConfirm {
    isTarjeta: boolean;
    draft: ReservationDraft;
    user: Person | null;
    paymentInfo: PaymentInfo | null;
    totalEstimate: number;
    onReset: () => void;
}

function CardConfirm({ isTarjeta, draft, user, paymentInfo, totalEstimate, onReset }: PropsCardConfirm) {
    return (
        <div className="py-12 px-4 max-w-xl mx-auto text-center animate-step-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                {isTarjeta ? "¡Pago y Reserva confirmados!" : "¡Reserva confirmada con éxito!"}
            </span>
            <h2 className="text-3xl font-bold text-white mt-1 mb-2">
                Te esperamos en Player Start
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto mb-8">
                {isTarjeta
                    ? "Tu pago con tarjeta fue simulado y aprobado. El turno ha quedado en estado RESERVADO."
                    : "Tu turno fue registrado como PENDIENTE. Abonás en efectivo al presentarte en mostrador."}
            </p>

            {/* Recibo elegante con esquema completo */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-8 space-y-4 backdrop-blur-sm">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-zinc-400">Nº de Reserva</span>
                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <span className="text-zinc-500 block mb-1">Fecha</span>
                        <span className="text-zinc-200 font-medium">
                            {draft.date ? formatLongDate(draft.date) : "-"}
                        </span>
                    </div>
                    <div>
                        <span className="text-zinc-500 block mb-1">Horario</span>
                        <span className="text-zinc-200 font-medium">
                            {draft.hour !== null ? `${formatHour(draft.hour)} a ${formatHour(draft.hour + draft.duration)}` : "-"}
                        </span>
                    </div>
                    <div>
                        <span className="text-zinc-500 block mb-1">Estación</span>
                        <span className="text-zinc-200 font-medium">
                            PC #{draft.computer?.pcNumber} ({draft.computer?.category?.name})
                        </span>
                    </div>
                    <div>
                        <span className="text-zinc-500 block mb-1">Titular</span>
                        <span className="text-zinc-200 font-medium">
                            {user?.name || user?.email || "Cliente"}
                        </span>
                    </div>
                    <div>
                        <span className="text-zinc-500 block mb-1">Medio de Pago</span>
                        <span className="text-zinc-200 font-medium">
                            {isTarjeta ? "Tarjeta (Crédito / Débito)" : "En Mostrador (Efectivo)"}
                        </span>
                    </div>
                    <div>
                        <span className="text-zinc-500 block mb-1">Estado de Pago</span>
                        <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${isTarjeta
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                                }`}
                        >
                            {isTarjeta ? "PAGADO (Aprobado)" : "PENDIENTE DE COBRO"}
                        </span>
                    </div>
                </div>

                {paymentInfo?.transactionId && (
                    <div className="flex justify-between pt-3 border-t border-white/10 text-xs">
                        <span className="text-zinc-500">Comprobante de Transacción</span>
                        <span className="text-zinc-300 font-mono font-semibold">{paymentInfo.transactionId}</span>
                    </div>
                )}

                <div className="flex justify-between pt-3 border-t border-white/10 items-baseline">
                    <span className="text-sm font-semibold text-zinc-300">Total</span>
                    <span className="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                        {formatPrice(totalEstimate)}
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    type="button"
                    onClick={onReset}
                    className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-zinc-200 text-sm font-medium hover:bg-white/10 transition-all cursor-pointer"
                >
                    Hacer otra reserva
                </button>
                <Link
                    to="/"
                    className="px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}
export default CardConfirm;
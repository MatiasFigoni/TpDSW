import { AlertCircle, ArrowRight, CalendarCheck, CreditCard } from "lucide-react";
import { formatPrice } from "../../../utils/reservationDates";
import type { Computer } from "../../../types/computer.class";
import type { PaymentMethod } from "../../../types/pay.type";
import type { Person } from "../../../types/person.class";
interface PropsPaymentResume {
    user: Person | null;
    computer: Computer | null;
    duration: number;
    paymentMethod: PaymentMethod | null;
    totalEstimate: number;
    submitError: Error | null;
    isSubmitting: boolean;
    onConfirm: () => void;
    date: string | null;
    hour: number | null;
    hourlyPrice: number;
}

function PaymentResume({ user, computer, duration, paymentMethod, totalEstimate, submitError, isSubmitting, onConfirm, date, hour, hourlyPrice }: PropsPaymentResume) {
    return (
        <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 sticky top-24 flex flex-col gap-6">
                <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    Detalle del pago
                </h3>

                <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-zinc-400">
                        <span>Precio por hora ({computer?.category?.name || "PC"})</span>
                        <span className="text-zinc-200">{formatPrice(hourlyPrice)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                        <span>Duración seleccionada</span>
                        <span className="text-zinc-200">{duration} {duration === 1 ? "hora" : "horas"}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                        <span>Medio de pago</span>
                        <span className={paymentMethod ? "text-zinc-200 font-medium" : "text-amber-400 font-medium"}>
                            {paymentMethod === 'tarjeta'
                                ? 'Tarjeta (Crédito/Débito)'
                                : paymentMethod === 'efectivo'
                                    ? 'En Mostrador (Efectivo)'
                                    : 'Sin seleccionar'}
                        </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                        <span>Cargo de servicio</span>
                        <span className="text-emerald-400 font-semibold">GRATIS</span>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                        <span className="text-sm font-semibold text-white">Total a pagar</span>
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                            {formatPrice(totalEstimate)}
                        </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 text-right">
                        {paymentMethod === 'tarjeta'
                            ? '* El pago se procesará inmediatamente de forma segura.'
                            : paymentMethod === 'efectivo'
                                ? '* Se abona en el local en efectivo al ingresar.'
                                : '* Seleccioná un medio de pago para continuar.'}
                    </p>
                </div>

                {submitError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{submitError.message}</span>
                    </div>
                )}

                <button
                    id="confirm-reservation-button"
                    type="button"
                    disabled={!user || isSubmitting || !computer || !date || hour === null || !paymentMethod}
                    onClick={onConfirm}
                    className="w-full py-4 rounded-xl font-bold text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {paymentMethod === 'tarjeta' ? 'Procesando pago y reserva...' : 'Confirmando reserva...'}
                        </span>
                    ) : !paymentMethod ? (
                        <span className="flex items-center gap-2 text-zinc-300">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            <span>Seleccioná un medio de pago</span>
                        </span>
                    ) : paymentMethod === 'tarjeta' ? (
                        <span className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span>Pagar con Tarjeta y Reservar</span>
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4" />
                            <span>Confirmar Reserva (En Mostrador)</span>
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    )}
                </button>
            </div>
        </div>
    )
}
export default PaymentResume;
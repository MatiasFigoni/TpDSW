import { AlertCircle, Banknote, CreditCard } from "lucide-react";
import { formatPrice } from "../../../../utils/reservationDates.ts";
import type { PaymentMethod } from "../../../../types/pay.type.ts";

interface Props {
    paymentMethod: PaymentMethod | null;
    onSelectPaymentMethod: (method: PaymentMethod | null) => void;
    totalEstimate: number;
}

function PaymentMethodComponent({ paymentMethod, onSelectPaymentMethod, totalEstimate }: Props) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-400" />
                        Elegir medio de pago
                    </h3>
                    <p className="text-xs text-zinc-400">
                        Seleccioná cómo deseás abonar la reserva antes de confirmar.
                    </p>
                </div>
                {!paymentMethod && (
                    <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                        Requerido
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => onSelectPaymentMethod('efectivo')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${paymentMethod === 'efectivo'
                        ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                        : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
                            <Banknote className="w-5 h-5" />
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'efectivo' ? 'border-blue-500 bg-blue-500' : 'border-zinc-600'
                            }`}>
                            {paymentMethod === 'efectivo' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">En Mostrador</p>
                        <p className="text-xs text-zinc-400 mt-0.5">Pago presencial en efectivo al llegar al local</p>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onSelectPaymentMethod('tarjeta')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${paymentMethod === 'tarjeta'
                        ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                        : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-blue-400">
                            <CreditCard className="w-5 h-5" />
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'tarjeta' ? 'border-blue-500 bg-blue-500' : 'border-zinc-600'
                            }`}>
                            {paymentMethod === 'tarjeta' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-white">Tarjeta de Débito / Crédito</p>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">Simulación inmediata con aprobación directa</p>
                    </div>
                </button>
            </div>

            {paymentMethod === 'tarjeta' && (
                <div className="bg-zinc-950/80 border border-blue-500/30 rounded-2xl p-4 space-y-3 animate-step-in">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-blue-400" /> Datos de Tarjeta de Prueba
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                            Aprobación Automática
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="col-span-2">
                            <label className="text-zinc-500 block mb-1">Número de Tarjeta</label>
                            <input
                                type="text"
                                disabled
                                value="4532 •••• •••• 8899"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-zinc-500 block mb-1">Vencimiento</label>
                            <input
                                type="text"
                                disabled
                                value="08/28"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-zinc-500 block mb-1">Código de Seguridad (CVV)</label>
                            <input
                                type="text"
                                disabled
                                value="742"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 font-mono"
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 italic">
                        * Como es una prueba, no se requiere verificación manual de seguridad; el pago se aprobará automáticamente al confirmar la reserva.
                    </p>
                </div>
            )}

            {paymentMethod === 'efectivo' && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1 animate-step-in">
                    <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4" /> Pago en efectivo en mostrador
                    </p>
                    <p className="text-amber-200/80">
                        Tu reserva quedará en estado <strong>PENDIENTE</strong>. Podrás abonar los <strong>{formatPrice(totalEstimate)}</strong> en caja al momento de ingresar.
                    </p>
                </div>
            )}

            {!paymentMethod && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400/90 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Debés seleccionar un medio de pago para habilitar la confirmación del turno.</span>
                </div>
            )}
        </div>
    )
}
export default PaymentMethodComponent;
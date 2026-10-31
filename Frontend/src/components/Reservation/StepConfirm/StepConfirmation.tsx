import { Calendar, Clock, Monitor, MapPin } from "lucide-react";
import type { ReservationDraft } from "../../../types/reservation.types.ts";
import type { Person } from "../../../types/person.class.ts";
import type { Turn } from "../../../types/turn.type.ts";
import { formatLongDate, formatHour } from "../../../utils/reservationDates.ts";
import type { PaymentInfo, PaymentMethod } from "../../../types/pay.type.ts";
import CardConfirm from "./components/CardConfirm.tsx";
import PaymentMethodComponent from "./components/paymentMethod.tsx";
import UserValidation from "./components/UserValidation.tsx";
import PaymentResume from "./components/PaymentResume.tsx";

interface StepConfirmationProps {
    draft: ReservationDraft;
    user: Person | null;
    isSubmitting: boolean;
    submitError: Error | null;
    createdTurn: Turn | null;
    paymentMethod: PaymentMethod | null;
    paymentInfo: PaymentInfo | null;
    onSelectPaymentMethod: (method: PaymentMethod | null) => void;
    onConfirm: () => void;
    onReset: () => void;
}

export function StepConfirmation({ draft, user, isSubmitting, submitError, createdTurn, paymentMethod, paymentInfo, onSelectPaymentMethod, onConfirm, onReset }: StepConfirmationProps) {
    const { computer, date, hour, duration } = draft;
    const hourlyPrice = computer?.category?.hourly_price ?? 0;
    const totalEstimate = hourlyPrice * duration;
    const isTarjeta = paymentMethod === 'tarjeta';

    if (createdTurn) {
        return (
            <CardConfirm
                isTarjeta={isTarjeta}
                draft={draft}
                user={user}
                paymentInfo={paymentInfo}
                totalEstimate={totalEstimate}
                onReset={onReset}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-step-in">
            {/* Columna Izquierda: Datos del Local, Medio de Pago y Titular */}
            <div className="lg:col-span-2 space-y-6">
                {/* 1. Datos del Local y Reserva */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Player Start Rosario</h3>
                            <p className="text-xs text-zinc-400">Zeballos 1351, Rosario, Santa Fe</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                        <div className="flex items-center gap-2 text-zinc-300">
                            <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                            <span>{date ? formatLongDate(date) : "Fecha a definir"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                                {hour !== null ? `${formatHour(hour)} - ${formatHour(hour + duration)} (${duration}h)` : "Horario"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                            <Monitor className="w-4 h-4 text-blue-400 shrink-0" />
                            <span>PC #{computer?.pcNumber} ({computer?.category?.name})</span>
                        </div>
                    </div>
                </div>

                {/* 2. Selector de Medio de Pago */}

                <PaymentMethodComponent
                    paymentMethod={paymentMethod}
                    onSelectPaymentMethod={onSelectPaymentMethod}
                    totalEstimate={totalEstimate}
                />

                {/* 3. Titular de la reserva */}
                <UserValidation user={user} />

                {/* 4. Políticas y Aviso */}
                <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-[11px] text-zinc-400 leading-relaxed space-y-1">
                    <p className="font-semibold text-zinc-300">Información importante:</p>
                    <p>• Tu reserva cuenta con una tolerancia de 10 minutos pasados la hora de inicio.</p>
                    <p>• Los menores de edad deben asistir con autorización o acompañados.</p>
                    <p>• Podrás solicitar extensiones horarias directamente en mostrador si hay disponibilidad.</p>
                </div>
            </div>

            {/* Columna Derecha: Resumen de Precio y Botón de Pago / Confirmación */}
            <PaymentResume
                user={user}
                computer={computer}
                duration={duration}
                paymentMethod={paymentMethod}
                totalEstimate={totalEstimate}
                submitError={submitError}
                isSubmitting={isSubmitting}
                onConfirm={onConfirm}
                date={date}
                hour={hour}
                hourlyPrice={hourlyPrice} />
        </div>
    );
}

export default StepConfirmation;

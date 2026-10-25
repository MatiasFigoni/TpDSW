import { Sparkles } from "lucide-react";
import {
    OPENING_HOUR,
    CLOSING_HOUR,
    BOOKING_WINDOW_DAYS,
} from "../../types/reservation.types.ts";
import {
    nextDays,
    toLocalDateKey,
    isClosedDay,
} from "../../utils/reservationDates.ts";
import SelectorHour from "./StepDateTimeComponents/SelectorHour.tsx";
import SelectorDay from "./StepDateTimeComponents/SelectorDay.tsx";
import SelectorTime from "./StepDateTimeComponents/SelectorTime.tsx";

interface StepDateTimeProps {
    date: string | null;
    hour: number | null;
    duration: number;
    onSelectDate: (date: string) => void;
    onSelectHour: (hour: number) => void;
    onChangeDuration: (duration: number) => void;
    onContinue: () => void;
}

export function StepDateTime({ date, hour, duration, onSelectDate, onSelectHour, onChangeDuration, onContinue }: StepDateTimeProps) {
    const days = nextDays(BOOKING_WINDOW_DAYS);
    const now = new Date();
    const todayKey = toLocalDateKey(now);
    const currentHour = now.getHours();

    // Generar horas posibles del local
    const availableHours: number[] = [];
    for (let h = OPENING_HOUR; h + duration <= CLOSING_HOUR; h++) {
        availableHours.push(h);
    }

    const isDateClosed = date ? isClosedDay(new Date(`${date}T12:00:00`)) : false;

    return (
        <div className="flex flex-col gap-8 animate-step-in">
            {/* 1. Selector de Duración */}
            <SelectorHour duration={duration} onChangeDuration={onChangeDuration} />

            {/* 2. Carrusel Horizontal de Días */}
            <SelectorDay
                days={days}
                date={date}
                todayKey={todayKey}
                isDateClosed={isDateClosed}
                onSelectDate={onSelectDate}
            />

            {/* 3. Grilla de Horarios */}
            {date && !isDateClosed && (
                <SelectorTime
                    availableHours={availableHours}
                    date={date}
                    hour={hour}
                    duration={duration}
                    todayKey={todayKey}
                    currentHour={currentHour}
                    onSelectHour={onSelectHour}
                />
            )}

            {/* Botón continuar */}
            <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                    id="reserve-datetime-continue"
                    type="button"
                    disabled={!date || hour === null || isDateClosed}
                    onClick={onContinue}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Continuar a Selección de PC</span>
                </button>
            </div>
        </div>
    );
}
export default StepDateTime;

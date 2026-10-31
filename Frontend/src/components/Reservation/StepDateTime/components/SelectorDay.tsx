import { AlertCircle, CalendarIcon } from "lucide-react";
import { isClosedDay, toLocalDateKey } from "../../../../utils/reservationDates";
interface PropsSelectorDay {
    days: Date[];
    date: string | null;
    todayKey: string;
    isDateClosed: boolean;
    onSelectDate: (date: string) => void;
}

function SelectorDay({ days, date, todayKey, isDateClosed, onSelectDate }: PropsSelectorDay) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-purple-400" />
                Seleccioná el día
            </label>
            <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/10">
                {days.map((d) => {
                    const dateKey = toLocalDateKey(d);
                    const isSelected = date === dateKey;
                    const closed = isClosedDay(d);
                    const isToday = dateKey === todayKey;

                    const dayName = d.toLocaleDateString("es-AR", { weekday: "short" });
                    const dayNumber = d.getDate();
                    const monthName = d.toLocaleDateString("es-AR", { month: "short" });

                    return (
                        <button
                            key={dateKey}
                            type="button"
                            disabled={closed}
                            onClick={() => onSelectDate(dateKey)}
                            className={`shrink-0 w-20 py-3.5 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-200 ${closed
                                ? "opacity-35 cursor-not-allowed border-zinc-800 bg-zinc-900/50 text-zinc-500"
                                : isSelected
                                    ? "bg-white text-zinc-950 font-bold border-white shadow-xl shadow-white/10 scale-105"
                                    : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/25"
                                }`}
                        >
                            <span className={`text-xs capitalize font-medium ${isSelected ? "text-zinc-700" : "text-zinc-400"}`}>
                                {isToday ? "Hoy" : dayName}
                            </span>
                            <span className="text-2xl font-bold tracking-tight">
                                {dayNumber}
                            </span>
                            <span className={`text-[11px] uppercase tracking-wider ${isSelected ? "text-zinc-600" : "text-zinc-500"}`}>
                                {closed ? "Cerrado" : monthName}
                            </span>
                        </button>
                    );
                })}
            </div>
            {isDateClosed && (
                <div className="flex items-center gap-2 text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl mt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>El local se encuentra cerrado los días lunes. Por favor seleccioná otra fecha.</span>
                </div>
            )}
        </div>
    )
}
export default SelectorDay;
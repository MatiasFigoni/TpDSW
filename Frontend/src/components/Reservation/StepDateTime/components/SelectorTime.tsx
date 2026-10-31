import { Clock } from "lucide-react";
import { formatHour } from "../../../../utils/reservationDates";
interface PropsSelectorTime {
    availableHours: number[];
    date: string;
    hour: number | null;
    duration: number;
    todayKey: string;
    currentHour: number;
    onSelectHour: (hour: number) => void;
}


function SelectorTime({ availableHours, date, hour, duration, todayKey, currentHour, onSelectHour }: PropsSelectorTime) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Horarios disponibles ({duration} {duration === 1 ? "hora" : "horas"})
                </label>
                <span className="text-xs text-zinc-400">
                    Apertura 08:00 a 24:00
                </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                {availableHours.map((h) => {
                    const isSelected = hour === h;
                    const isPast = date === todayKey && h <= currentHour;

                    return (
                        <button
                            key={h}
                            type="button"
                            disabled={isPast}
                            onClick={() => onSelectHour(h)}
                            className={`py-3 px-2 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center ${isPast
                                ? "opacity-30 cursor-not-allowed border-zinc-800 bg-zinc-900/30 text-zinc-600"
                                : isSelected
                                    ? "bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold border-transparent shadow-lg shadow-purple-500/30 scale-105"
                                    : "bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10 hover:border-white/30"
                                }`}
                        >
                            <span className="text-sm font-semibold tracking-wide">
                                {formatHour(h)}
                            </span>
                            <span className={`text-[10px] mt-0.5 ${isSelected ? "text-blue-100" : "text-zinc-500"}`}>
                                a {formatHour(h + duration)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    )
}
export default SelectorTime;
import { Clock } from "lucide-react";
import { MAX_DURATION } from "../../../../types/reservation.types";
interface PropsSelectHour {
    duration: number;
    onChangeDuration: (duration: number) => void;
}
const scheduleHours:number[] = [];
for (let i = 0; i < MAX_DURATION; i++) {
    scheduleHours.push(i + 1);
}

function SelectorHour({ duration, onChangeDuration }: PropsSelectHour) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                ¿Cuántas horas quieres reservar?
            </label>
            <div className="grid grid-cols-3 md:grid-cols-8 gap-3 ">
                {scheduleHours.map((hrs) => {
                    const isSelected = duration === hrs;
                    return (
                        <button
                            key={hrs}
                            type="button"
                            onClick={() => onChangeDuration(hrs)}
                            className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1 ${isSelected
                                ? "bg-linear-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/20 scale-[1.02]"
                                : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20"
                                }`}
                        >
                            <span className="text-base">{hrs} {hrs === 1 ? "Hora" : "Horas"}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    )
}
export default SelectorHour;
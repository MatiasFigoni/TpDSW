import { Monitor, Check, AlertCircle, Sparkles } from "lucide-react";
import type { Computer } from "../../types/computer.class.ts";
import { formatPrice } from "../../utils/reservationDates.ts";
import Loading from "../Loading/loading.tsx";

interface StepComputerProps {
    computers: Computer[];
    selectedComputer: Computer | null;
    duration: number;
    isLoading: boolean;
    error: Error | null;
    onSelectComputer: (pc: Computer) => void;
    onContinue: () => void;
}

export function StepComputer({ computers, selectedComputer, duration, isLoading, error, onSelectComputer, onContinue }: StepComputerProps) {

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center">
                <Loading />
                <p className="mt-4 text-sm text-zinc-400 animate-pulse">
                    Consultando disponibilidad en tiempo real...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-16 px-6 rounded-2xl border border-red-500/20 bg-red-500/10 text-center max-w-lg mx-auto">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-1">Sin disponibilidad</h3>
                <p className="text-sm text-zinc-300">{error.message}</p>
                <p className="text-xs text-zinc-400 mt-3">Probá seleccionando otro horario o fecha previa.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-step-in">
            {/* Header del paso con filtro rápido si hay varias categorías */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/0 pb-4">
                <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-blue-400" />
                        Estaciones Disponibles ({computers.length})
                    </h2>
                    <p className="text-xs text-zinc-400">
                        Elegí tu puesto favorito dentro del cibercafé
                    </p>
                </div>
            </div>

            {computers.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-dashed border-white/10 p-8">
                    <Monitor className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-300 font-medium">No hay computadoras disponibles para este criterio.</p>
                    <p className="text-zinc-500 text-xs mt-1">Elegí otro rango horario o revisá otras categorías.</p>
                </div>
            ) : (
                /* Grilla interactiva de puestos (Cyber Stations) */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {computers.map((pc) => {
                        const isSelected = selectedComputer?.id === pc.id;
                        const isGamer = pc.category?.name?.toLowerCase() === "gamer";
                        const price = (pc.category?.hourly_price ?? 0) * duration;

                        return (
                            <button
                                key={pc.id}
                                id={`pc-station-${pc.pcNumber}`}
                                type="button"
                                onClick={() => onSelectComputer(pc)}
                                className={`group relative p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 ${isSelected
                                    ? "bg-linear-to-b from-blue-600/20 to-purple-600/20 border-blue-400 shadow-xl shadow-blue-500/20 scale-[1.02] ring-2 ring-blue-500/50"
                                    : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20 hover:-translate-y-1"
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md animate-pop">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${isGamer
                                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                }`}
                                        >
                                            {pc.pcNumber}
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-white block">
                                                Estación #{pc.pcNumber}
                                            </span>
                                            <span
                                                className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full inline-block ${isGamer
                                                    ? "bg-blue-500/10 text-blue-400"
                                                    : "bg-emerald-500/10 text-emerald-400"
                                                    }`}
                                            >
                                                {pc.category?.name ?? "General"}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                                        {pc.description || "Estación completa con periféricos mecánicos y monitor de alta tasa de refresco."}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
                                    <span className="text-xs text-zinc-400">Total {duration}h</span>
                                    <span className="text-base font-bold text-white">
                                        {formatPrice(price)}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Continuar */}
            <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                    id="reserve-computer-continue"
                    type="button"
                    disabled={!selectedComputer}
                    onClick={onContinue}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Continuar al Resumen</span>
                </button>
            </div>
        </div>
    );
}

export default StepComputer;

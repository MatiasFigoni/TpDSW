import { ArrowLeft, Check } from "lucide-react";
import { RESERVATION_STEPS, type ReservationStep } from "../../types/reservation.types.ts";

interface StepHeaderProps {
    step: ReservationStep;
    maxReachedStep: ReservationStep;
    onBack?: () => void;
    onGoTo: (step: ReservationStep) => void;
}

function StepHeader({ step, maxReachedStep, onBack, onGoTo }: StepHeaderProps) {
    const current = RESERVATION_STEPS.find((s) => s.id === step)!;

    return (
        <header className="mb-6 flex flex-col gap-5 sm:mb-8">
            <div className="flex items-center gap-3">
                {onBack && (
                    <button
                        id="reserve-back-btn"
                        type="button"
                        onClick={onBack}
                        aria-label="Volver al paso anterior"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all hover:-translate-x-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                )}
                <div key={step} className="animate-step-in">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                        Paso {step} de {RESERVATION_STEPS.length}
                    </p>
                    <h1 className="text-lg font-semibold text-white sm:text-2xl">{current.title}</h1>
                </div>
            </div>

            {/* Indicador de progreso */}
            <ol className="grid grid-cols-4 gap-2" aria-label="Progreso de la reserva">
                {RESERVATION_STEPS.map((s) => {
                    const done = s.id < step;
                    const active = s.id === step;
                    const reachable = s.id <= maxReachedStep && !active;
                    return (
                        <li key={s.id}>
                            <button
                                id={`reserve-progress-${s.id}`}
                                type="button"
                                disabled={!reachable}
                                onClick={() => onGoTo(s.id)}
                                className="group flex w-full flex-col gap-2 text-left disabled:cursor-default"
                            >
                                <span
                                    className={`h-1.5 w-full rounded-full transition-all duration-500 ${done
                                            ? "bg-linear-to-r from-blue-500 to-purple-500"
                                            : active
                                                ? "bg-linear-to-r from-blue-500 to-purple-500 shadow-[0_0_12px] shadow-blue-500/60"
                                                : "bg-white/10"
                                        }`}
                                />
                                <span
                                    className={`hidden items-center gap-1.5 text-xs font-medium sm:flex ${active ? "text-white" : done ? "text-zinc-400 group-hover:text-white" : "text-zinc-600"
                                        }`}
                                >
                                    {done && <Check className="h-3 w-3 text-emerald-400" />}
                                    {s.short}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </header>
    );
}

export default StepHeader;

import { Loader2, Zap } from 'lucide-react';
import { useAvailableHours } from '../../hooks/hooksTurns.ts';

interface TimeSlotStepProps {
  selectedDate: string;
  selectedHour: number | null;
  selectedDuration: number;
  categoryId?: number;
  onSelectHour: (hour: number) => void;
  onSelectDuration: (duration: number) => void;
}

function formatHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`;
}

export default function TimeSlotStep({
  selectedDate,
  selectedHour,
  selectedDuration,
  categoryId,
  onSelectHour,
  onSelectDuration,
}: TimeSlotStepProps) {
  const { data: availableHours = [], isPending, isError } = useAvailableHours(
    selectedDate,
    categoryId
  );

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isToday = selectedDate === todayStr;

  // Filter out hours in the past if today
  const filteredHours = availableHours.filter((h) => {
    if (isToday && h <= now.getHours()) {
      return false;
    }
    return true;
  });

  const durations = [
    { value: 1, label: '1 Hora' },
    { value: 2, label: '2 Horas' },
    { value: 3, label: '3 Horas' },
  ];

  // Format selected date for display
  const dateDisplay = selectedDate
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : '';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Horarios disponibles</h2>
        <p className="text-zinc-400 text-sm">
          <span className="capitalize">{dateDisplay}</span> — Seleccioná tu turno y duración.
        </p>
      </div>

      {isPending ? (
        <div className="flex flex-col items-center justify-center py-14 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
          <p className="text-sm">Consultando horarios disponibles...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 max-w-md mx-auto">
          <p className="font-semibold mb-1">Error al consultar disponibilidad</p>
          <p className="text-sm opacity-80">No se pudieron cargar los horarios para esta fecha.</p>
        </div>
      ) : filteredHours.length === 0 ? (
        <div className="text-center py-12 text-zinc-400 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 max-w-md mx-auto">
          <p className="font-semibold text-white mb-1">No hay horarios disponibles</p>
          <p className="text-sm text-zinc-500">
            No quedan computadoras libres en esta fecha. Por favor elegí otro día en el calendario.
          </p>
        </div>
      ) : (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Grid with ONLY available hours */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {filteredHours.map((hour) => {
              const isSelected = selectedHour === hour;

              return (
                <button
                  key={hour}
                  onClick={() => onSelectHour(hour)}
                  className={`py-3 px-3 text-sm rounded-xl border font-semibold transition-all duration-200 text-center cursor-pointer
                    ${isSelected
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30 scale-105'
                      : 'bg-zinc-900/90 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white'
                    }
                  `}
                >
                  {formatHour(hour)}
                </button>
              );
            })}
          </div>

          {/* Duration selector */}
          {selectedHour !== null && (
            <div className="pt-6 border-t border-zinc-800 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                Duración de la sesión
              </h4>
              <div className="flex gap-3">
                {durations.map((dur) => {
                  const exceedsClosing = selectedHour + dur.value > 24;
                  const isSelected = selectedDuration === dur.value;

                  return (
                    <button
                      key={dur.value}
                      disabled={exceedsClosing}
                      onClick={() => onSelectDuration(dur.value)}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200
                        ${exceedsClosing
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-40'
                          : isSelected
                            ? 'bg-zinc-100 border-white text-zinc-950 font-bold shadow-lg'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer'
                        }
                      `}
                    >
                      {dur.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-500 text-center">
                Horario: {formatHour(selectedHour)} — {formatHour(selectedHour + selectedDuration)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

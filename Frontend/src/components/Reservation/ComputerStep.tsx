import { Monitor, CheckCircle2, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import type { Computer } from '../../types/computer.class.ts';
import type { Category } from '../../types/category.class.ts';
import { useAvailableComputers } from '../../hooks/hooksTurns.ts';

interface ComputerStepProps {
  selectedDate: string;
  selectedHour: number;
  selectedDuration: number;
  category: Category;
  selectedComputerId: string | null;
  paymentMethod: 'mostrador' | 'tarjeta';
  onSelectPaymentMethod: (method: 'mostrador' | 'tarjeta') => void;
  onSelectComputer: (computer: Computer) => void;
}

export default function ComputerStep({
  selectedDate,
  selectedHour,
  selectedDuration,
  category,
  selectedComputerId,
  paymentMethod,
  onSelectPaymentMethod,
  onSelectComputer,
}: ComputerStepProps) {
  const { data, isPending, isError, error } = useAvailableComputers(
    selectedDate,
    selectedHour,
    category.id,
    true
  );

  const totalPrice = category.hourly_price * selectedDuration;

  const dateDisplay = new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const formatHour = (h: number) => `${String(h).padStart(2, '0')}:00`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Elegí tu equipo</h2>
        <p className="text-zinc-400 text-sm">
          Seleccioná la computadora que querés usar y el medio de pago.
        </p>
      </div>

      {/* Summary card */}
      <div className="max-w-xl mx-auto bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
          <div>
            <span className="text-zinc-500 text-xs block">Categoría</span>
            <span className="text-white font-medium capitalize">{category.name}</span>
          </div>
          <div>
            <span className="text-zinc-500 text-xs block">Fecha</span>
            <span className="text-white font-medium capitalize">{dateDisplay}</span>
          </div>
          <div>
            <span className="text-zinc-500 text-xs block">Horario</span>
            <span className="text-white font-medium">
              {formatHour(selectedHour)} — {formatHour(selectedHour + selectedDuration)}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 text-xs block">Precio total</span>
            <span className="text-blue-400 font-bold text-lg">${totalPrice.toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>

      {/* Computer grid */}
      <div className="max-w-xl mx-auto">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
            <p className="text-sm">Buscando computadoras disponibles...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-red-400">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm">{error.message}</p>
          </div>
        ) : data && data.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm">No hay computadoras disponibles para este horario.</p>
            <p className="text-xs text-zinc-600 mt-1">Probá otro horario o categoría.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-zinc-500 mb-3">
              {data?.totalAvailable} {data?.totalAvailable === 1 ? 'equipo disponible' : 'equipos disponibles'}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {data?.data.map((computer) => {
                const isSelected = selectedComputerId === computer.id;

                return (
                  <button
                    key={computer.id}
                    onClick={() => onSelectComputer(computer)}
                    className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer group
                      ${isSelected
                        ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/10 scale-[1.03]'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80'
                      }
                    `}
                  >
                    <Monitor
                      className={`w-6 h-6 transition-colors ${
                        isSelected ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    />
                    <span className={`text-lg font-bold transition-colors ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {computer.pcNumber}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      PC
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="absolute -top-1.5 -right-1.5 w-5 h-5 text-blue-400 bg-zinc-950 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Selector de Medio de Pago (visible una vez seleccionado el equipo) */}
      {selectedComputerId !== null && (
        <div className="max-w-xl mx-auto pt-6 border-t border-zinc-800 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Elegir medio de pago
            </h3>
            <p className="text-xs text-zinc-400">
              Seleccioná cómo deseás abonar la reserva antes de confirmar.
            </p>
          </div>

          <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => onSelectPaymentMethod(e.target.value as 'mostrador' | 'tarjeta')}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="mostrador">En Mostrador (Pago presencial al llegar al local)</option>
              <option value="tarjeta">Tarjeta (Crédito / Débito - Simulación inmediata)</option>
            </select>
          </div>

          {/* Formulario simulado de tarjeta */}
          {paymentMethod === 'tarjeta' && (
            <div className="bg-zinc-950 border border-blue-500/30 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
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
        </div>
      )}
    </div>
  );
}

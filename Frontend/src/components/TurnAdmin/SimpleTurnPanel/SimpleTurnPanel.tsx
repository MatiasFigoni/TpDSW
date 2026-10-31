import { useState, useMemo } from 'react';
import { PlayCircle, CheckCircle, Clock, Loader2, ChevronDown, ChevronUp, AlertTriangle, Banknote, } from 'lucide-react';
import type { Turn, TurnStatus } from '../../../types/turn.type.ts';
import { useUpdateTurnStatus, useUpdatePaymentStatus } from '../../../hooks/hooksTurns.ts';
import SimpleFilters from './components/SimpleFilters.tsx';
import PcInfo from './components/TurnSimpleInfo.tsx';
import TurnDetails from './components/TurnDetails.tsx';
import ClientDetails from './components/ClientDetails.tsx';
import PaysDetails from './components/PaysDetails.tsx';
import { toLocalDateKey } from '../../../utils/reservationDates.ts';

interface SimpleTurnPanelProps {
  turns: Turn[];
  isLoading: boolean;
}

export function IsOlderThanOneDay(turnStartTime: string): boolean {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const StartTime = new Date(turnStartTime).getTime();
  // Tiempo de ahora (ms) - Tiempo de inicio (ms) > 1 día (ms)
  const isOlderThanOneDay = (new Date()).getTime() - StartTime > oneDayMs;
  return isOlderThanOneDay;
}

export default function SimpleTurnPanel({ turns, isLoading }: SimpleTurnPanelProps) {
  const updateStatusMutation = useUpdateTurnStatus();
  const updatePaymentMutation = useUpdatePaymentStatus();

  // Filters for simple view
  const today = toLocalDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleMarkPaymentPaid = (payId: number) => {
    updatePaymentMutation.mutate({ id: payId, status: 'PAGADO' });
  };

  const handleStatusChange = (turn: Turn, newStatus: TurnStatus) => {
    if (newStatus === 'CANCELADO') {
      const confirmCancel = window.confirm(`¿Estás seguro de que deseas cancelar el turno #${turn.id}? Esta acción no se puede deshacer.`);
      if (!confirmCancel) return;
    }
    updateStatusMutation.mutate({ id: turn.id, status: newStatus });
  };

  // Filter out past/finished turns and apply filters:
  const filteredTurns = useMemo(() => {
    return turns
      .filter((turn) => {
        const isOlderThanOneDay = IsOlderThanOneDay(turn.startTime);

        // Si el turno es de la fecha seleccionada (ej. hoy), mostrarlo (salvo finalizados/cancelados).
        // Y si quedó INICIADO de un día anterior (+1 día), mostrarlo también como alerta aunque selectedDate sea hoy:
        const turnDateStr = toLocalDateKey(new Date(turn.startTime));
        const matchesDate = !selectedDate || turnDateStr === selectedDate;
        const isStuckStarted = isOlderThanOneDay && turn.status === 'INICIADO';

        if (!matchesDate && !isStuckStarted) return false;

        // Filter by date if selected
        if (selectedDate) {
          const turnDateStr = toLocalDateKey(new Date(turn.startTime));
          if (turnDateStr !== selectedDate) return false;
        }

        // Filter by category
        if (categoryFilter !== 'all') {
          if (turn.computer?.category?.name?.toLowerCase() !== categoryFilter.toLowerCase()) {
            return false;
          }
        }

        if (turn.status === 'FINALIZADO' || turn.status === 'CANCELADO') return false;

        return true;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [turns, selectedDate, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Simple Filters */}
      <SimpleFilters
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        todayStr={today}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        filteredTurns={filteredTurns}
      />

      {/* Turns list */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
          <p className="text-sm">Cargando turnos próximos...</p>
        </div>
      ) : filteredTurns.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
          <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">No hay turnos próximos</h3>
          <p className="text-sm text-zinc-500">
            No se encontraron reservas pendientes o por iniciar para los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredTurns.map((turn, index) => {
            const isUpdating = updateStatusMutation.isPending && updateStatusMutation.variables?.id === turn.id;
            const updatingPayId = updatePaymentMutation.isPending ? (updatePaymentMutation.variables?.id ?? null) : null;

            const isFirstNext = index === 0;
            const isExpanded = expandedId === turn.id;
            // Check if turn was scheduled more than 1 day ago
            const isOlderThanOneDay = IsOlderThanOneDay(turn.startTime);
            // Safe calculation avoiding NaN
            const hourlyPrice = turn.computer?.category?.hourly_price || 0;
            const duration = turn.duration || 1;
            const extraPrice = turn.extraPrice || 0;
            const totalPrice = hourlyPrice * duration + extraPrice;
            const pendingPay = turn.pays?.find((p) => p.status === 'PENDIENTE');
            return (
              <div
                key={turn.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${turn.status === 'INICIADO'
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : isFirstNext
                    ? 'bg-zinc-900 border-blue-500/50 shadow-lg shadow-blue-500/5'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                  }`}>

                {/* Main Visible Row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Time & PC & Quick Info */}
                  <PcInfo
                    isOlderThanOneDay={isOlderThanOneDay}
                    turn={turn}
                    isExpanded={isExpanded}
                    setExpandedId={setExpandedId}
                    totalPrice={totalPrice}
                  />

                  {/* Right: Actions & Expand Button */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    {/* Botón rápido Cobrar en Efectivo si el pago está PENDIENTE */}
                    {pendingPay && (
                      <button
                        disabled={updatingPayId === pendingPay.id}
                        onClick={() => handleMarkPaymentPaid(pendingPay.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md shadow-amber-600/20 cursor-pointer disabled:opacity-50"
                        title="Marcar pago como Cobrado / Pagado"
                      >
                        {updatingPayId === pendingPay.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Banknote className="w-3.5 h-3.5" />
                        )}
                        Cobrar Efectivo
                      </button>
                    )}

                    {/* Check-in button (shows warning on click if > 1 day old) */}
                    {(turn.status === 'RESERVADO' || turn.status === 'PENDIENTE') && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(turn, 'INICIADO')}
                        className={`flex items-center whitespace-nowrap gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer disabled:opacity-50 ${isOlderThanOneDay
                          ? 'bg-amber-600/80 hover:bg-amber-600 text-white shadow-amber-600/20'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                          }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <PlayCircle className="w-4 h-4" />
                        )}
                        Check-in
                      </button>
                    )}

                    {turn.status === 'INICIADO' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(turn, 'FINALIZADO')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm transition-all border border-zinc-700 cursor-pointer disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        )}
                        Finalizar Turno
                      </button>
                    )}

                    {/* Desplegable Toggle Button */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : turn.id)}
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Menos info' : 'Validar datos'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Desplegable de Validación de Datos (Detalles del Turno y Cliente) */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-zinc-800/80 bg-zinc-950/60 space-y-4 animate-in fade-in duration-200">
                    {isOlderThanOneDay && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                        <span>
                          <strong>Atención:</strong> Este turno fue programado para hace más de un día. Si cambiás su estado, se solicitará confirmación.
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* 1. Datos del Cliente para validar identidad */}
                      <ClientDetails turn={turn} />

                      {/* 2. Detalle del Turno */}
                      <TurnDetails
                        turn={turn}
                        hourlyPrice={hourlyPrice}
                        totalPrice={totalPrice} />

                      {/* 3. Pagos Asociados */}

                      <PaysDetails
                        turn={turn}
                        updatingPayId={updatingPayId}
                        handleMarkPaymentPaid={handleMarkPaymentPaid} />
                    </div>

                    {/* Footer del Desplegable */}
                    <div className="flex items-center justify-end pt-2 border-t border-zinc-800/80 text-xs">
                      {turn.status !== 'CANCELADO' &&
                        <button
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(turn, 'CANCELADO')}
                          className="whitespace-nowrap rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-red-300 hover:bg-red-800 hover:text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        >
                          Cancelar turno
                        </button>
                      }
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
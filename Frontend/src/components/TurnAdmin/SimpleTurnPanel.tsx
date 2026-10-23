import { useState, useMemo } from 'react';
import {
  PlayCircle,
  CheckCircle,
  Clock,
  Monitor,
  User,
  Calendar,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  CreditCard,
  AlertTriangle,
  Banknote,
} from 'lucide-react';
import type { Turn, TurnStatus } from '../../types/turn.class.ts';
import { useUpdateTurnStatus, useUpdatePaymentStatus } from '../../hooks/hooksTurns.ts';

interface SimpleTurnPanelProps {
  turns: Turn[];
  isLoading: boolean;
}

export default function SimpleTurnPanel({ turns, isLoading }: SimpleTurnPanelProps) {
  const updateStatusMutation = useUpdateTurnStatus();
  const updatePaymentMutation = useUpdatePaymentStatus();

  // Filters for simple view
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [updatingPayId, setUpdatingPayId] = useState<number | null>(null);

  const handleMarkPaymentPaid = async (payId: number) => {
    setUpdatingPayId(payId);
    try {
      await updatePaymentMutation.mutateAsync({ id: payId, status: 'PAGADO' });
    } finally {
      setUpdatingPayId(null);
    }
  };

  const handleStatusChange = async (turn: Turn, newStatus: TurnStatus) => {
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const isOlderThanOneDay = now.getTime() - new Date(turn.startTime).getTime() > oneDayMs;

    if (isOlderThanOneDay) {
      const formattedDate = new Date(turn.startTime).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const confirmed = window.confirm(
        `⚠️ ADVERTENCIA: Este turno fue programado para hace más de un día (${formattedDate}).\n\n¿Estás seguro de que deseás cambiar el estado a "${newStatus}" de todas formas?`
      );
      if (!confirmed) return;
    }

    setUpdatingId(turn.id);
    try {
      await updateStatusMutation.mutateAsync({ id: turn.id, status: newStatus });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter out past/finished turns and apply filters:
  const filteredTurns = useMemo(() => {
    const now = new Date();

    return turns
      .filter((turn) => {
        const turnEndTime = new Date(turn.endTime);
        const turnStartTime = new Date(turn.startTime);

        // Don't show old/past turns that already ended before now, unless they are currently INICIADO
        if (turn.status === 'FINALIZADO' || turn.status === 'CANCELADO') {
          return false;
        }
        if (turnEndTime < now && turn.status !== 'INICIADO') {
          return false;
        }

        // Filter by date if selected
        if (selectedDate) {
          const turnDateStr = turnStartTime.toISOString().split('T')[0];
          if (turnDateStr !== selectedDate) return false;
        }

        // Filter by category
        if (categoryFilter !== 'all') {
          if (turn.computer?.category?.description?.toLowerCase() !== categoryFilter.toLowerCase()) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [turns, selectedDate, categoryFilter]);

  const formatHour = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const now = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;

  return (
    <div className="space-y-6">
      {/* Filters bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Date picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedDate === todayStr
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Hoy
          </button>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todas las categorías</option>
            <option value="gamer">Gaming Pro</option>
            <option value="oficina">Trabajo / Oficina</option>
          </select>
        </div>

        <div className="text-xs text-zinc-400">
          Mostrando <span className="text-white font-bold">{filteredTurns.length}</span> turnos próximos
        </div>
      </div>

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
            const isUpdating = updatingId === turn.id;
            const isFirstNext = index === 0;
            const isExpanded = expandedId === turn.id;

            const isReserved = turn.status === 'RESERVADO';
            const isPending = turn.status === 'PENDIENTE';
            const isStarted = turn.status === 'INICIADO';

            // Check if turn was scheduled more than 1 day ago
            const turnStartTime = new Date(turn.startTime).getTime();
            const isOlderThanOneDay = now.getTime() - turnStartTime > oneDayMs;

            // Safe calculation avoiding NaN
            const hourlyPrice = Number(turn.computer?.category?.hourly_price) || 0;
            const duration = Number(turn.duration) || 1;
            const extraPrice = Number(turn.extraPrice) || 0;
            const totalPrice = hourlyPrice * duration + extraPrice;

            return (
              <div
                key={turn.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isStarted
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : isFirstNext
                      ? 'bg-zinc-900 border-blue-500/50 shadow-lg shadow-blue-500/5'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Main Visible Row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Time & PC & Quick Info */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : turn.id)}
                    className="flex items-center gap-4 cursor-pointer flex-1"
                  >
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-800 text-center shrink-0">
                      <span className="text-xs text-zinc-500 uppercase font-semibold">PC</span>
                      <span className="text-xl font-black text-white">#{turn.computer.pcNumber}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-bold text-base">
                          {formatHour(turn.startTime)} - {formatHour(turn.endTime)}
                        </span>
                        <span className="text-xs text-zinc-500">({turn.duration}h)</span>

                        {/* Status badge */}
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                            isStarted
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : isReserved
                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          }`}
                        >
                          {turn.status}
                        </span>

                        {isOlderThanOneDay && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3 h-3" /> +1 día
                          </span>
                        )}
                      </div>

                      {/* Client quick info */}
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="font-semibold text-white">
                          {turn.client.name} {turn.client.lastname ?? ''}
                        </span>
                        <span className="text-xs text-zinc-500">({turn.client.email})</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span>{turn.computer?.category?.name ?? 'General'}</span>
                        <span>•</span>
                        <span className="text-blue-400 font-bold">
                          ${totalPrice > 0 ? totalPrice.toLocaleString('es-AR') : '0'}
                        </span>
                        {/* Indicador de Pago (Efectivo / Mostrador / Tarjeta) */}
                        {(() => {
                          const hasPendingPay = turn.pays?.some((p) => p.status === 'PENDIENTE');
                          const hasPaidPay = turn.pays?.some((p) => p.status === 'PAGADO');
                          const isCash = turn.pays?.some((p) => p.method === 'efectivo') || turn.status === 'PENDIENTE';

                          if (hasPendingPay || (!hasPaidPay && turn.status === 'PENDIENTE')) {
                            return (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                                <Banknote className="w-3 h-3 text-amber-400" />
                                {isCash ? 'Cobro en Mostrador (Efectivo)' : 'Pago Pendiente'}
                              </span>
                            );
                          }
                          if (hasPaidPay) {
                            return (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                                <CreditCard className="w-3 h-3" />
                                Pago Confirmado
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Expand Button */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    {/* Botón rápido Cobrar en Efectivo si el pago está PENDIENTE */}
                    {turn.pays?.some((p) => p.status === 'PENDIENTE') && (
                      <button
                        disabled={updatingPayId !== null}
                        onClick={() => {
                          const pendingPay = turn.pays?.find((p) => p.status === 'PENDIENTE');
                          if (pendingPay) handleMarkPaymentPaid(pendingPay.id);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md shadow-amber-600/20 cursor-pointer disabled:opacity-50"
                        title="Marcar pago en efectivo como Cobrado / Pagado"
                      >
                        {updatingPayId !== null ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Banknote className="w-3.5 h-3.5" />
                        )}
                        Cobrar Efectivo
                      </button>
                    )}

                    {/* Check-in button (shows warning on click if > 1 day old) */}
                    {(isReserved || isPending) && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(turn, 'INICIADO')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer disabled:opacity-50 ${
                          isOlderThanOneDay
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

                    {isStarted && (
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
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-400" /> Datos del Cliente
                        </span>
                        <p className="text-zinc-200">
                          <strong className="text-zinc-400">Nombre:</strong> {turn.client.name} {turn.client.lastname ?? ''}
                        </p>
                        <p className="text-zinc-200 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-500" /> {turn.client.email}
                        </p>
                        {turn.client.phoneNumber ? (
                          <p className="text-zinc-200 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-zinc-500" /> {turn.client.phoneNumber}
                          </p>
                        ) : (
                          <p className="text-zinc-500 italic">Sin teléfono registrado</p>
                        )}
                        {turn.client.dni && (
                          <p className="text-zinc-200">
                            <strong className="text-zinc-400">DNI:</strong> {turn.client.dni}
                          </p>
                        )}
                      </div>

                      {/* 2. Detalle del Turno */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1 flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-blue-400" /> Detalle de la Estación
                        </span>
                        <p className="text-zinc-200">
                          <strong className="text-zinc-400">Turno ID:</strong> #{turn.id}
                        </p>
                        <p className="text-zinc-200">
                          <strong className="text-zinc-400">Fecha / Hora:</strong> {formatDateTime(turn.startTime)}
                        </p>
                        <p className="text-zinc-200">
                          <strong className="text-zinc-400">Categoría:</strong> {turn.computer?.category?.name ?? 'General'}
                        </p>
                        <p className="text-zinc-200">
                          <strong className="text-zinc-400">Tarifa / hora:</strong> ${hourlyPrice > 0 ? hourlyPrice.toLocaleString('es-AR') : '0'}
                        </p>
                        <p className="text-blue-400 font-bold">
                          Total Turno: ${totalPrice > 0 ? totalPrice.toLocaleString('es-AR') : '0'}
                        </p>
                      </div>

                      {/* 3. Pagos Asociados */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Pagos Registrados
                        </span>
                        {turn.pays && turn.pays.length > 0 ? (
                          turn.pays.map((pay) => (
                            <div key={pay.id} className="border-b border-zinc-800 last:border-0 pb-1.5">
                              <div className="flex items-center justify-between">
                                <p className="text-zinc-200 font-semibold">${pay.amount} ({pay.method})</p>
                                {pay.status === 'PENDIENTE' && (
                                  <button
                                    disabled={updatingPayId === pay.id}
                                    onClick={() => handleMarkPaymentPaid(pay.id)}
                                    className="px-2 py-0.5 text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-white rounded cursor-pointer disabled:opacity-50"
                                  >
                                    {updatingPayId === pay.id ? 'Registrando...' : 'Marcar Pagado'}
                                  </button>
                                )}
                              </div>
                              <p className="text-zinc-500 text-[10px]">
                                Tx: {pay.transactionId} •{' '}
                                <span className={pay.status === 'PAGADO' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                                  {pay.status === 'PENDIENTE' ? 'PENDIENTE DE PAGO' : pay.status}
                                </span>
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-zinc-500 italic">Sin pagos registrados aún (Cobro en mostrador)</p>
                        )}
                      </div>
                    </div>

                    {/* Footer del Desplegable */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                      <span className="text-zinc-400">
                        Verificá los datos del cliente (DNI / Teléfono) antes de dar inicio a la sesión.
                      </span>

                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(turn, 'CANCELADO')}
                        className="text-zinc-500 hover:text-red-400 text-xs underline cursor-pointer"
                      >
                        Cancelar turno
                      </button>
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

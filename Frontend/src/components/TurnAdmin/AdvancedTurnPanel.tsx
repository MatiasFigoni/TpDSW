import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Phone,
  Mail,
  User,
  Monitor,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertTriangle,
  Banknote,
} from 'lucide-react';
import type { Turn, TurnStatus } from '../../types/turn.class.ts';
import { useUpdateTurnStatus, useUpdatePaymentStatus } from '../../hooks/hooksTurns.ts';

interface AdvancedTurnPanelProps {
  turns: Turn[];
  isLoading: boolean;
}

export default function AdvancedTurnPanel({ turns, isLoading }: AdvancedTurnPanelProps) {
  const updateStatusMutation = useUpdateTurnStatus();
  const updatePaymentMutation = useUpdatePaymentStatus();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  const now = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const handleStatusChange = async (turn: Turn, newStatus: TurnStatus) => {
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

  const filteredTurns = useMemo(() => {
    return turns
      .filter((turn) => {
        // Status filter
        if (statusFilter !== 'all' && turn.status !== statusFilter) {
          return false;
        }

        // Date range filter
        const turnDate = turn.startTime.split('T')[0];
        if (startDate && turnDate < startDate) return false;
        if (endDate && turnDate > endDate) return false;

        // Search filter (User name, email, phone, dni, or PC number)
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          const fullName = `${turn.client.name} ${turn.client.lastname ?? ''}`.toLowerCase();
          const email = (turn.client.email ?? '').toLowerCase();
          const phone = (turn.client.phoneNumber ?? '').toLowerCase();
          const dni = (turn.client.dni ?? '').toLowerCase();
          const pcNum = turn.computer.pcNumber.toString();

          const matches =
            fullName.includes(term) ||
            email.includes(term) ||
            phone.includes(term) ||
            dni.includes(term) ||
            pcNum === term;

          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [turns, statusFilter, startDate, endDate, searchTerm]);

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

  const statusBadge = (status: TurnStatus) => {
    switch (status) {
      case 'INICIADO':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'RESERVADO':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'PENDIENTE':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'FINALIZADO':
        return 'bg-zinc-800 border-zinc-700 text-zinc-400';
      case 'CANCELADO':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return 'bg-zinc-800 text-zinc-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
        {/* Top search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Nombre, Email, Teléfono, DNI o N° de PC..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800/80 text-sm">
          {/* Status selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="RESERVADO">RESERVADO</option>
              <option value="INICIADO">INICIADO</option>
              <option value="FINALIZADO">FINALIZADO</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs">Desde:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs">Hasta:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          {(searchTerm || statusFilter !== 'all' || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-blue-400 hover:text-blue-300 underline ml-auto cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Results stats */}
      <div className="flex justify-between items-center text-xs text-zinc-400 px-2">
        <span>
          Encontrados: <strong className="text-white">{filteredTurns.length}</strong> turnos
        </span>
      </div>

      {/* Table / Cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
          <p className="text-sm">Cargando historial de turnos...</p>
        </div>
      ) : filteredTurns.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
          <Search className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">Sin resultados</h3>
          <p className="text-sm text-zinc-500">No hay turnos que coincidan con los criterios de búsqueda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTurns.map((turn) => {
            const isExpanded = expandedId === turn.id;
            const isUpdating = updatingId === turn.id;
            const isOlderThanOneDay = now.getTime() - new Date(turn.startTime).getTime() > oneDayMs;

            // Safe price calculations
            const hourlyPrice = Number(turn.computer?.category?.hourly_price) || 0;
            const duration = Number(turn.duration) || 1;
            const extraPrice = Number(turn.extraPrice) || 0;
            const totalPrice = hourlyPrice * duration + extraPrice;

            return (
              <div
                key={turn.id}
                className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200"
              >
                {/* Main row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : turn.id)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-800/40"
                >
                  {/* Left info */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                      <span className="text-[10px] text-zinc-500 font-semibold">PC</span>
                      <span className="text-lg font-black text-white">#{turn.computer.pcNumber}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-white font-semibold text-sm">
                          {turn.client.name} {turn.client.lastname ?? ''}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusBadge(
                            turn.status
                          )}`}
                        >
                          {turn.status}
                        </span>

                        {isOlderThanOneDay && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3 h-3" /> +1 día
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                        <span>{formatDateTime(turn.startTime)}</span>
                        <span>•</span>
                        <span>{turn.duration} hs</span>
                        <span>•</span>
                        <span>{turn.computer?.category?.name ?? 'General'}</span>
                        <span>•</span>
                        <span className="text-blue-400 font-bold">
                          ${totalPrice > 0 ? totalPrice.toLocaleString('es-AR') : '0'}
                        </span>
                        {/* Indicador de Pago */}
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

                  {/* Right: Expand arrow */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      {isExpanded ? 'Menos info' : 'Más info'}
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-zinc-800/80 bg-zinc-950/50 space-y-4 animate-in fade-in duration-200">
                    {isOlderThanOneDay && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                        <span>
                          <strong>Advertencia:</strong> Este turno fue programado para hace más de un día. Cualquier cambio de estado solicitará confirmación.
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Client card */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-1 flex items-center gap-1">
                          <User className="w-3 h-3" /> Datos del Cliente
                        </span>
                        <p className="text-zinc-200">
                          <strong>Nombre:</strong> {turn.client.name} {turn.client.lastname ?? ''}
                        </p>
                        <p className="text-zinc-200 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-zinc-500" /> {turn.client.email}
                        </p>
                        {turn.client.phoneNumber && (
                          <p className="text-zinc-200 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-zinc-500" /> {turn.client.phoneNumber}
                          </p>
                        )}
                        {turn.client.dni && (
                          <p className="text-zinc-200">
                            <strong>DNI:</strong> {turn.client.dni}
                          </p>
                        )}
                      </div>

                      {/* Turn details */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-1 flex items-center gap-1">
                          <Monitor className="w-3 h-3" /> Detalle del Turno
                        </span>
                        <p className="text-zinc-200">
                          <strong>ID Turno:</strong> #{turn.id}
                        </p>
                        <p className="text-zinc-200">
                          <strong>Inicio:</strong> {formatDateTime(turn.startTime)}
                        </p>
                        <p className="text-zinc-200">
                          <strong>Fin:</strong> {formatDateTime(turn.endTime)}
                        </p>
                        <p className="text-zinc-200">
                          <strong>Categoría:</strong> {turn.computer?.category?.name ?? 'General'}
                        </p>
                        <p className="text-zinc-200">
                          <strong>Tarifa / hora:</strong> ${hourlyPrice > 0 ? hourlyPrice.toLocaleString('es-AR') : '0'}
                        </p>
                        {extraPrice > 0 && (
                          <p className="text-zinc-200">
                            <strong>Cargos extra:</strong> ${extraPrice}
                          </p>
                        )}
                        <p className="text-blue-400 font-bold mt-1">
                          Total Turno: ${totalPrice > 0 ? totalPrice.toLocaleString('es-AR') : '0'}
                        </p>
                      </div>

                      {/* Payment info */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-1 flex items-center gap-1">
                          <CreditCard className="w-3 h-3" /> Pagos Asociados
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
                          <p className="text-zinc-500 italic">Sin pagos registrados aún</p>
                        )}
                      </div>
                    </div>

                    {/* Change status action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/60">
                      <span className="text-xs text-zinc-500">Cambiar estado manualmente:</span>
                      <div className="flex flex-wrap gap-2">
                        {turn.status !== 'INICIADO' && (
                          <button
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(turn, 'INICIADO')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer disabled:opacity-50"
                          >
                            Marcar INICIADO (Check-in)
                          </button>
                        )}
                        {turn.status !== 'RESERVADO' && (
                          <button
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(turn, 'RESERVADO')}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer disabled:opacity-50"
                          >
                            Marcar RESERVADO
                          </button>
                        )}
                        {turn.status !== 'FINALIZADO' && (
                          <button
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(turn, 'FINALIZADO')}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 cursor-pointer disabled:opacity-50"
                          >
                            Marcar FINALIZADO
                          </button>
                        )}
                        {turn.status !== 'CANCELADO' && (
                          <button
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(turn, 'CANCELADO')}
                            className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white font-semibold text-xs border border-red-500/30 cursor-pointer disabled:opacity-50"
                          >
                            CANCELAR
                          </button>
                        )}
                      </div>
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

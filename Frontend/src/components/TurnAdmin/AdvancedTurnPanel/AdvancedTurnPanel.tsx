import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, AlertTriangle, } from 'lucide-react';
import type { Turn, TurnStatus } from '../../../types/turn.type.ts';
import { useUpdateTurnStatus, useUpdatePaymentStatus } from '../../../hooks/hooksTurns.ts';
import PaysDetails from './components/PaysDetails.tsx';
import TurnDetails from './components/TurnDetails.tsx';
import ClientDetails from './components/ClientDetails.tsx';
import FiltersTurn from './components/FiltersTurn.tsx';
import Loading from '../../Loading/loading.tsx';
import ChangeStatus from './components/ChangeStatus.tsx';
import QuickInfoTurn from './components/QuickInfoTurn.tsx';
import { formatHour, toLocalDateKey } from '../../../utils/reservationDates.ts';
import { IsOlderThanOneDay } from '../SimpleTurnPanel/SimpleTurnPanel.tsx';

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

  const handleMarkPaymentPaid = (payId: number) => {
    updatePaymentMutation.mutate({ id: payId, status: 'PAGADO' });
  };

  const handleStatusChange = (turn: Turn, newStatus: TurnStatus) => {
    if (IsOlderThanOneDay(turn.startTime)) {
      const formattedDate = toLocalDateKey(new Date(turn.startTime)) + ' ' + formatHour(new Date(turn.startTime).getHours());
      const confirmed = window.confirm(
        `⚠️ ADVERTENCIA: Este turno fue programado para hace más de un día (${formattedDate}).\n\n¿Estás seguro de que deseás cambiar el estado a "${newStatus}" de todas formas?`
      );
      if (!confirmed) return;
    }
    updateStatusMutation.mutate({ id: turn.id, status: newStatus });
  };

  const filteredTurns = useMemo(() => {
    return turns
      .filter((turn) => {
        // Status filter
        if (statusFilter !== 'all' && turn.status !== statusFilter) {
          return false;
        }

        // Date range filter
        const turnDate = toLocalDateKey(new Date(turn.startTime));
        if (startDate && turnDate < startDate) return false;
        if (endDate && turnDate > endDate) return false;

        // Search filter (User name, email, phone, dni, or PC number)
        if (searchTerm !== '') {
          const term = searchTerm.trim().toLowerCase();
          const fullName = `${turn.client.name} ${turn.client.lastName ?? ''}`.toLowerCase();
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

  return (
    <div className="space-y-6">
      <FiltersTurn
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      {/* Results stats */}
      <div className="flex justify-between items-center text-xs text-zinc-400 px-2">
        <span>
          Encontrados: <strong className="text-white">{filteredTurns.length}</strong> turnos
        </span>
      </div>
      {/* Table / Cards */}
      {isLoading ? (
        <Loading message="Cargando historial de turnos..." />
      ) : filteredTurns.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
          <Search className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-1">Sin resultados</h3>
          <p className="text-sm text-zinc-500">No hay turnos que coincidan con los criterios de búsqueda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTurns.map((turn) => {
            const isUpdating = updateStatusMutation.isPending && updateStatusMutation.variables?.id === turn.id;
            const updatingPayId = updatePaymentMutation.isPending ? (updatePaymentMutation.variables?.id ?? null) : null;

            const isExpanded = expandedId === turn.id;
            const isOlderThanOneDay = IsOlderThanOneDay(turn.startTime);

            // Safe price calculations
            const hourlyPrice = Number(turn.computer?.category?.hourly_price) || 0;
            const duration = Number(turn.duration) || 1;
            const extraPrice = Number(turn.extraPrice) || 0;
            const totalPrice = hourlyPrice * duration + extraPrice;

            return (
              <div
                key={turn.id}
                className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200" >
                {/* Main row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : turn.id)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-800/40" >
                  {/* Left info */}
                  <QuickInfoTurn
                    turn={turn}
                    totalPrice={totalPrice}
                    isOlderThanOneDay={isOlderThanOneDay} />
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
                      <ClientDetails turn={turn} />
                      {/* Turn details */}
                      <TurnDetails
                        turn={turn}
                        hourlyPrice={hourlyPrice}
                        totalPrice={totalPrice} />
                      {/* Payment info */}
                      <PaysDetails
                        turn={turn}
                        updatingPayId={updatingPayId}
                        handleMarkPaymentPaid={handleMarkPaymentPaid}
                      />
                    </div>
                    {/* Change status action buttons */}
                    <ChangeStatus
                      turn={turn}
                      isUpdating={isUpdating}
                      handleStatusChange={handleStatusChange}
                    />
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

import { useState } from 'react';
import { Zap, Search, Plus, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { useTurns } from '../../hooks/hooksTurns.ts';
import SimpleTurnPanel from '../../components/TurnAdmin/SimpleTurnPanel.tsx';
import AdvancedTurnPanel from '../../components/TurnAdmin/AdvancedTurnPanel.tsx';

export default function TurnAdmin() {
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
  const { data: turns = [], isLoading, isError, error } = useTurns();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-500" />
            Panel de Turnos
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Control de asistencia, check-in en mostrador y gestión integral de reservas.
          </p>
        </div>

        <Link
          to="/reservar"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo Turno
        </Link>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit mb-8">
        <button
          onClick={() => setViewMode('simple')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            viewMode === 'simple'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          Vista Mostrador (Próximos)
        </button>

        <button
          onClick={() => setViewMode('advanced')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            viewMode === 'advanced'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Search className="w-4 h-4" />
          Vista Avanzada (Histórico)
        </button>
      </div>

      {/* Error state */}
      {isError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error.message}
        </div>
      )}

      {/* Selected View */}
      {viewMode === 'simple' ? (
        <SimpleTurnPanel turns={turns} isLoading={isLoading} />
      ) : (
        <AdvancedTurnPanel turns={turns} isLoading={isLoading} />
      )}
    </section>
  );
}

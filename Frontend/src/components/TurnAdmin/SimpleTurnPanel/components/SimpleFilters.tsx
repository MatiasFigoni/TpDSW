import { Calendar } from "lucide-react";
import type { Turn } from "../../../../types/turn.type.ts";
interface SimpleFiltersProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  todayStr: string;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  filteredTurns: Turn[]; 
}

function SimpleFilters({ selectedDate, setSelectedDate, todayStr, categoryFilter, setCategoryFilter, filteredTurns }: SimpleFiltersProps) {
    return(
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
    )
}

export default SimpleFilters;
import { Filter, Search } from "lucide-react";
import type { TurnStatus } from "../../../../types/turn.type.ts";

interface FiltersTurnProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
}
function FiltersTurn({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, startDate, setStartDate, endDate, setEndDate }: FiltersTurnProps) {
    const turnStatusOptions: TurnStatus[] = ['PENDIENTE', 'RESERVADO', 'INICIADO', 'FINALIZADO', 'CANCELADO'];
    return (
        <div>
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
                            {turnStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date range */}
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-xs">Desde:</span>
                        <input
                            type="date"
                            value={startDate}
                            max={endDate || undefined}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-xs">Hasta:</span>
                        <input
                            type="date"
                            value={endDate}
                            min={startDate || undefined}
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
        </div>
    )
}
export default FiltersTurn;
import { useQuery } from "@tanstack/react-query";
import { fetchComputers } from "../../services/computerServices.ts";
import { Gamepad2, BriefcaseBusiness, } from 'lucide-react';
import { Computer } from "../../types/computer.class.ts";
import './PcMap.css';
import PcDescription from '../../components/PcDescription/pcDescription.tsx'
import { useState } from "react";
import Loading from "../../components/Loading/loading.tsx";
import Error from "../../components/Error/Error.tsx";

interface StylesItem {
    bg: string,
    toolItem: React.JSX.Element,
}

export const getStyles = (c: Computer) => {
    let styles: StylesItem;
    switch (c.category.description) {
        case 'gamer':
            styles = { bg: 'bg-blue-500/10 border-blue-500/40 text-blue-500 hover:bg-blue-500/20', toolItem: <Gamepad2 /> };
            break;
        case 'oficina':
            styles = { bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/20', toolItem: <BriefcaseBusiness /> }
            break;
        default:
            styles = { bg: '', toolItem: <></> };
            break;
    }
    return styles;
}

function PcMap() {
    const [selectedPc, setSelectedPc] = useState<Computer>();
    const computerListQuery = useQuery({
        queryKey: ['computers-map'],
        queryFn: fetchComputers,

    },);
    if (computerListQuery.isPending) {
        return (
            <Loading/>
        );
    }
    if (computerListQuery.isError) {
        return (
            <Error error={computerListQuery.error.message}/>
        );
    };

    return (
        <section className="pt-32 pb-24 min-h-screen bg-zinc-950 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-medium tracking-tight text-white mb-3">Selecciona tu estación</h2>
                    <p className="text-zinc-400 text-base md:text-lg">Pasa el cursor o toca una máquina para ver sus especificaciones. Haz clic para seleccionarla.</p>
                </div>
                <div className="flex not-lg:flex-col gap-8 items-center ">
                    <div className="w-full lg:w-2/3 bg-zinc-900 p-6 md:p-10 rounded-3xl border border-zinc-800  relative">
                        <div className="flex flex-wrap gap-4 mb-10 text-xs sm:text-sm font-medium text-zinc-400 justify-center">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50"></div> Gaming Pro</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></div> Trabajo</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-zinc-800 border border-zinc-700"></div> Ocupado</div>
                        </div>
                        <div className="flex justify-center grid-computers">
                            {computerListQuery.data.map((c: Computer) => {
                                const styles: StylesItem = getStyles(c);
                                const isSelected = selectedPc?.id === c.id;
                                return (
                                    <div key={c.id}
                                        onClick={() => c.status === 'disponible' && setSelectedPc(c)}
                                        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border-2 flex justify-center items-center group 
                                                ${c.status === 'mantenimiento' ? 'bg-zinc-800 border-zinc-700 text-zinc-500 opacity-50 cursor-not-allowed' : ''} 
                                                ${styles.bg}
                                                ${isSelected ? 'ring-1 ring-white ring-offset-3 ring-offset-zinc-900 scale-110 shadow-xl z-10' : ''}`}>
                                        {styles.toolItem}

                                        <span className="text-sm sm:text-lg font-bold">{c.pcNumber}</span>
                                        {/* Hover de Pc Description */}
                                        <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                                            {/* Cabecera del Hover */}
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-white font-bold text-sm">PC {c.pcNumber}</span>
                                                <span className="text-xs uppercase tracking-wider text-zinc-400">{c.status}</span>
                                            </div>
                                            {/* Cuerpo del Hover */}
                                            <div className="space-y-1">
                                                <span className="text-zinc-300 text-xs">
                                                    <span className="font-semibold text-zinc-500">Categoría:</span> {c.category.description}
                                                </span>
                                                <span className="text-zinc-300 text-xs line-clamp-2">
                                                    {c.description}
                                                </span>
                                                <span className="text-blue-400 text-sm font-semibold mt-2">
                                                    ${c.category.hourly_price} / hora
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mt-16 h-10 w-48 bg-zinc-950 border border-zinc-800 rounded-t-2xl mx-auto flex items-end justify-center pb-2 text-zinc-500 text-xs font-medium uppercase tracking-widest">
                            Entrada / Café
                        </div>
                    </div>
                    <PcDescription selectedPc={selectedPc} />
                </div>


            </div>
        </section >
    );
};

export default PcMap;
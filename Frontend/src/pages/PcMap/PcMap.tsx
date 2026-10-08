import { Gamepad2, BriefcaseBusiness, Mouse, ArrowRight, } from 'lucide-react';
import { Computer } from "../../types/computer.class.ts";
import './PcMap.css';
import PcDescription from '../../components/PcItemDescription/PcItemDescription.tsx'
import { useState } from "react";
import Loading from "../../components/Loading/loading.tsx";
import Error from "../../components/Error/Error.tsx";

import CategorySelect from "../../components/CategorySelect/CategorySelect.tsx";
import { useComputers } from "../../hooks/hooksComputers.ts";
import { useCategoryId } from '../../hooks/hooksCategories.ts';

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
    const [category, setCategory] = useState<string>('');

    const { data: categoryId } = useCategoryId(category);
    const { data: computerQuery, isPending, isError, error } = useComputers(categoryId)

    const handlerCategory = (description: string): void => {
        setCategory(description);
    }

    if (isPending) {
        return (
            <Loading />
        );
    }

    if (isError) {
        return (
            <Error error={error.message} />
        );
    };

    return (
        <section className="pt-32 pb-24 min-h-screen bg-zinc-950 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-medium tracking-tight text-white mb-3">Selecciona tu estación</h2>
                    <p className="text-zinc-400 text-base md:text-lg">Pasa el cursor o toca una máquina para ver sus especificaciones. Haz clic para seleccionarla.</p>
                </div>
                <div className="flex my-4 md:text-lg justify-center">
                    <div className="flex md:px-16 p-2 bg-zinc-900 gap-x-2 text-zinc-400 rounded-3xl border border-zinc-800">
                        <p className="m-2">Filtrar categoria:</p>
                        <CategorySelect value={category} onChange={handlerCategory} />
                    </div>
                </div>
                <div className="flex not-lg:flex-col gap-8 items-center ">
                    <div className="w-full lg:w-2/3 bg-zinc-900 p-6 md:p-10 rounded-3xl border border-zinc-800  relative">
                        <div className="flex flex-wrap gap-4 mb-10 text-xs sm:text-sm font-medium text-zinc-400 justify-center">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50"></div> Gaming Pro</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></div> Trabajo</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-zinc-800 border border-zinc-700"></div> Ocupado</div>
                        </div>
                        <div className="flex justify-center grid-computers">
                            {computerQuery.map((c: Computer) => {
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
                    <div className="w-full lg:w-1/3 bg-zinc-900 p-6 rounded-3xl border border-zinc-800  top-28 transition-all duration-300">
                        <h3 className="text-lg font-medium text-white mb-6 border-b border-zinc-800 pb-4">Detalles del Equipo</h3>
                        {!selectedPc ? (
                            <div className="min-h-60 flex flex-col justify-center items-center text-center">
                                <Mouse className="w-12 h-12 text-zinc-700 mb-4 animate-pulse" />
                                <p className="text-zinc-500 text-sm px-4">Selecciona una máquina en el mapa para ver sus características y proceder con la reserva.</p>
                            </div>
                        ) : (
                            <>
                                <PcDescription selectedPc={selectedPc} />
                                <div className="pt-6 border-t border-zinc-800 mt-auto">
                                    <button className="w-full bg-blue-600 text-white font-medium py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20">
                                        <span>Reservar este Equipo</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section >
    );
};

export default PcMap;
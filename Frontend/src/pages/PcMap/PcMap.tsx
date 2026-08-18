import { useQuery } from "@tanstack/react-query";
import { fetchComputers } from "../../services/computerServices.ts";
import { Gamepad2, BriefcaseBusiness, } from 'lucide-react';
import { Computer } from "../../types/computer.class.ts";
import './PcMap.css';

interface StylesItem{
    bg:string,
    toolItem: any,
}

function PcMap() {
    const computerListQuery = useQuery({
        queryKey: ['computers-map'],
        queryFn: fetchComputers,
        
    },);

    if (computerListQuery.isPending) {
        return (
            <div>
                Cargando...
            </div>);
    }
    if (computerListQuery.isError) {
        return (
            <div>
                Hubo un error... <br />
                Error: {computerListQuery.error.message}
            </div>);
    };
    const getStyles = (c:Computer) =>{
        let styles:StylesItem;
        switch (c.category.description) {
            case 'gamer':
                styles = { bg: 'bg-blue-500/10 border-blue-500/40 text-blue-500 hover:bg-blue-500/20', toolItem: <Gamepad2/> };
                break;
            case 'oficina':
                styles = { bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/20', toolItem: <BriefcaseBusiness /> }
                break;
            default:
                styles = {bg: '',toolItem: null};
                break;
        }
        return styles;
    }
    return (
        <section className="pt-32 pb-24 min-h-screen bg-zinc-950 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-medium tracking-tight text-white mb-3">Selecciona tu estación</h2>
                    <p className="text-zinc-400 text-base md:text-lg">Pasa el cursor o toca una máquina para ver sus especificaciones. Haz clic para seleccionarla.</p>
                </div>
                <div className="flex flex-col gap-8 items-center">
                    <div className="w-full lg:w-2/3 bg-zinc-900 p-6 md:p-10 rounded-3xl border border-zinc-800 overflow-x-auto relative">
                        <div className="flex flex-wrap gap-4 mb-10 text-xs sm:text-sm font-medium text-zinc-400 justify-center">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50"></div> Gaming Pro</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></div> Trabajo</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-zinc-800 border border-zinc-700"></div> Ocupado</div>
                        </div>
                        <div className="flex justify-center grid-computers">
                            {computerListQuery.data.map((c:Computer) => {
                                const styles:StylesItem = getStyles(c);
                                return(
                                <div key={c.id} 
                                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center 
                                                ${c.status ==='mantenimiento'? 'bg-zinc-800 border-zinc-700 text-zinc-500 opacity-50 cursor-not-allowed': ''} 
                                                ${styles.bg}`}>{styles.toolItem}
                                </div>
                                )
                            })}
                        </div>
                    <div className="mt-16 h-10 w-48 bg-zinc-950 border border-zinc-800 rounded-t-2xl mx-auto flex items-end justify-center pb-2 text-zinc-500 text-xs font-medium uppercase tracking-widest">
                        Entrada / Café
                    </div>
                    </div>
                </div>


            </div>
        </section >
  );
};

export default PcMap;
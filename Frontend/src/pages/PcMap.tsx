import { useQuery } from "@tanstack/react-query";
import { fetchComputers } from "../services/computerServices.ts";
import type { Computer } from "../types/computer.class.ts";

function PcMap() {
    const computerListQuery = useQuery({
        queryKey: ['computers'],
        queryFn: fetchComputers,
        
    },);

    if (computerListQuery.isPending)
        return (
            <div>
                Cargando...
            </div>);

    if (computerListQuery.isError)
        return (
            <div>
                Hubo un error... <br />
                Error: {computerListQuery.error.message}
            </div>);


    return (
        <section className="pt-32 pb-24 min-h-screen bg-zinc-950 overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12 text-center md:text-left">
                    <h2 className="text-3xl font-medium tracking-tight text-white mb-3">Selecciona tu estación</h2>
                    <p className="text-zinc-400 text-base md:text-lg">Pasa el cursor o toca una máquina para ver sus especificaciones. Haz clic para seleccionarla.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="w-full lg:w-2/3 bg-zinc-900 p-6 md:p-10 rounded-3xl border border-zinc-800 overflow-x-auto relative">
                        <div className="flex flex-wrap gap-4 mb-10 text-xs sm:text-sm font-medium text-zinc-400 justify-center lg:justify-start">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50"></div> Gaming Pro</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></div> Trabajo</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-zinc-800 border border-zinc-700"></div> Ocupado</div>
                        </div>
                    </div>
                    

                    <div className="mt-16 h-10 w-48 bg-zinc-950 border border-zinc-800 rounded-t-2xl mx-auto flex items-end justify-center pb-2 text-zinc-500 text-xs font-medium uppercase tracking-widest">
                        Entrada / Café
                    </div>
                </div>

                
            </div>
        </section >
  );
};

export default PcMap;
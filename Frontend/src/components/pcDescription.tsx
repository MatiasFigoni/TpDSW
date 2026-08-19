import { Computer } from "../types/computer.class.ts";
import { Mouse, ArrowRight, Gamepad2, BriefcaseBusiness, Cpu, MemoryStick, Monitor, Gpu } from 'lucide-react';

interface pcDescProp {
    selectedPc: Computer | void
}
interface StylesItem {
    bg:string,
    toolItem: any,
}
interface Component {
    icon:any,
    value:string,
    label:string,
}
export default function PcDescription({ selectedPc }: pcDescProp) {

    function pcComponents(c:Computer):Component[]{
        const monitor = '27" IPS 1440p 240Hz';
        const ram = '32GB DDR5 6000MHz'
        const [cpu,gpu] = c.description.split('+').map(part=>part.trim());
        
        return ([
            {
                icon: <Cpu/>,
                value: cpu,
                label: 'Procesador'
            }, 
            {
                icon: <Gpu/>,
                value: gpu,
                label: 'Tarjeta Grafica'
            },
            {
                icon: <MemoryStick/>,
                value: ram,
                label: 'Memoria Ram'
            },
            {
                icon: <Monitor/>,
                value: monitor,
                label: 'Monitor'
            }])
    }
    function getStyles(c:Computer){
        let styles:StylesItem;
        switch (c.category.description) {
            case 'gamer':
                styles = { bg: 'bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider', toolItem: <Gamepad2/> };
                break;
            case 'oficina':
                styles = { bg: 'bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider', toolItem: <BriefcaseBusiness /> }
                break;
            default:
                styles = {bg: '',toolItem: null};
                break;
        }
        return styles;
    }
    return (
        <div className="w-full lg:w-1/3 bg-zinc-900 p-6 rounded-3xl border border-zinc-800 lg:sticky top-28 transition-all duration-300">
            <h3 className="text-lg font-medium text-white mb-6 border-b border-zinc-800 pb-4">Detalles del Equipo</h3>

            {!selectedPc ? (
                <div className="min-h-60 flex flex-col justify-center items-center text-center">
                    <Mouse className="w-12 h-12 text-zinc-700 mb-4 animate-pulse" />
                    <p className="text-zinc-500 text-sm px-4">Selecciona una máquina en el mapa para ver sus características y proceder con la reserva.</p>
                </div>
            ) : (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h4 className="text-4xl font-bold text-white mb-2">Pc Nro{selectedPc.pcNumber}</h4>
                                <span className={getStyles(selectedPc).bg}>{selectedPc.category.description}</span>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center text-zinc-400 border border-zinc-800 shadow-inner">
                                {getStyles(selectedPc).toolItem}
                            </div>
                        </div>
                        <div className="space-y-3 grow mb-6">
                            {pcComponents(selectedPc).map((stat, i) => (
                                <div key={i} className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-400">
                                        {stat.icon}  
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium mb-0.5">{stat.label}</p>
                                        <p className="text-sm font-semibold text-zinc-200">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-zinc-800 mt-auto">
                            <button className="w-full bg-blue-600 text-white font-medium py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20">
                                <span>Reservar este Equipo</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                </div>
            )}
        </div>
    )

}
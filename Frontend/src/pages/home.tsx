import { Cpu, Wifi, Armchair, Coffee } from 'lucide-react';

const Features = () => {
    const features = [
        { icon: Cpu, title: "Hardware Top", desc: "RTX 40 Series & Periféricos Pro" },
        { icon: Wifi, title: "Ping Zero", desc: "Fibra simétrica dedicada 1Gbps" },
        { icon: Armchair, title: "Ergonomía", desc: "Sillas Herman Miller & Secretlab" },
        { icon: Coffee, title: "Fuel", desc: "Cafetería de especialidad y snacks" }
    ];

    return (
        <section className="py-12 border-t border-zinc-800 bg-zinc-900 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-zinc-800">
                    {features.map((f, i) => (
                        <div key={i} className="flex flex-col items-center text-center px-4">
                            <f.icon className="w-8 h-8 text-blue-500 mb-3" />
                            <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                            <p className="text-xs text-zinc-400">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

function Home() {
    return (
    <>
        <section className="pt-10 pb-20 md:pt-20 md:pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh] text-center relative overflow-hidden bg-zinc-900">
            {/* Decorative Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-100 h-100 bg-purple-600/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            <div className="max-w-3xl mx-auto flex flex-col items-center z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-8">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Espacios disponibles ahora
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight text-white">
                    Tu espacio para <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-500">crear y jugar.</span>
                </h1>

                <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
                    El cibercafé reimaginado. Estaciones de alto rendimiento para gaming competitivo, diseño profesional o simplemente enfocarte en tu trabajo con el mejor café.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                        className="w-full sm:w-auto bg-blue-600 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                        Reserva Rápida
                    </button>
                    <a href="#equipos" className="w-full sm:w-auto bg-zinc-900 text-zinc-100 font-medium px-8 py-3.5 rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 border border-zinc-800">
                        Ver Mapa de PCs
                    </a>
                </div>
            </div>
        </section>
        <Features />
    </>
    );
};



export default Home;
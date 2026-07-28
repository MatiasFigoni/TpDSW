import { Cpu,Wifi,Armchair,Coffee } from "lucide-react";
function Features(){
    const features = [
        { icon: Cpu, title: "Hardware Top", desc: "RTX 40 Series & Periféricos Pro" },
        { icon: Wifi, title: "Ping Zero", desc: "Fibra simétrica dedicada 1Gbps" },
        { icon: Armchair, title: "Ergonomía", desc: "Sillas Herman Miller & Secretlab" },
        { icon: Coffee, title: "Fuel", desc: "Cafetería de especialidad y snacks" },
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
export default Features;
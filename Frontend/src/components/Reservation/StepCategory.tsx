import { BriefcaseBusiness, Gamepad2, Layers, Monitor } from "lucide-react";
import type { Category } from "../../types/category.class.ts";
import { formatPrice } from "../../utils/reservationDates.ts";

interface StepCategoryProps {
    categories: Category[];
    selected: Category | null;
    onSelect: (category: Category | null) => void;
}

const ColorsCategory: Record<string, { icon: React.ReactNode; ring: string; glow: string; text: string }> = {
    gamer: {
        icon: <Gamepad2 className="h-6 w-6" />,
        ring: "hover:border-blue-500/60",
        glow: "from-blue-500/20",
        text: "text-blue-400",
    },
    oficina: {
        icon: <BriefcaseBusiness className="h-6 w-6" />,
        ring: "hover:border-emerald-500/60",
        glow: "from-emerald-500/20",
        text: "text-emerald-400",
    },
};

const Default_ColorCategory = {
    icon: <Monitor className="h-6 w-6" />,
    ring: "hover:border-purple-500/60",
    glow: "from-purple-500/20",
    text: "text-purple-400",
};

function StepCategory({ categories, selected, onSelect }: StepCategoryProps) {
    return (
        <div className="grid animate-step-in gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Opción "cualquiera" */}
            <button
                id="reserve-category-any"
                type="button"
                onClick={() => onSelect(null)}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-black/40"
            >
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-zinc-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-zinc-200">
                    <Layers className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Cualquier equipo</h2>
                    <p className="mt-1 text-sm text-zinc-400">Mostrame todas las PCs disponibles en mi horario.</p>
                </div>
                <span className="mt-auto text-sm font-medium text-zinc-300">Ver todas →</span>
            </button>

            {categories.map((cat) => {
                const colorCategory = ColorsCategory[cat.name.toLowerCase()] ?? Default_ColorCategory;
                const isSelected = selected?.id === cat.id;
                return (
                    <button
                        id={`reserve-category-${cat.id}`}
                        key={cat.id}
                        type="button"
                        onClick={() => onSelect(cat)}
                        className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-white/5 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-black/40 
                            ${colorCategory.ring} ${isSelected ? "border-white/60 ring-2 ring-white/20" : "border-white/10"
                            }`}
                    >
                        <div
                            className={`pointer-events-none absolute inset-0 bg-linear-to-br ${colorCategory.glow} to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
                        />
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ${colorCategory.text}`}>
                            {colorCategory.icon}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold capitalize text-white">{cat.name}</h2>
                            <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{cat.description}</p>
                        </div>
                        <div className="mt-auto flex items-baseline gap-1">
                            <span className={`text-2xl font-bold ${colorCategory.text}`}>{formatPrice(cat.hourly_price)}</span>
                            <span className="text-sm text-zinc-500">/ hora</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export default StepCategory;

import { useCategory } from "../../hooks/hooksCategories.ts";
interface categorySelectProps {
    value: string,
    onChange: (description: string) => void
}

function CategorySelect({ value, onChange }: categorySelectProps) {
    const { data: categories, error, isError, isPending } = useCategory();
    if (isError) {
        return (
            <select disabled className="bg-zinc-900 text-red-400 rounded-3xl p-1 border border-red-800">
                <option>{error?.message || "Error al cargar categorías"}</option>
            </select>
        );
    };
    if (isPending) {
        return (
            <select disabled className="bg-zinc-900 text-zinc-400 rounded-3xl p-1 border border-zinc-800">
                <option>Cargando categorías...</option>
            </select>
        );
    };
    return (
        <select className="bg-zinc-900 hover:bg-zinc-800 rounded-3xl p-1" value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">-Opcion-</option>
            {categories.map((c) => (
                <option key={c.id} value={c.description}>{c.description}</option>
            ))}
        </select>
    )
};

export default CategorySelect;
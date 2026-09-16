import { useCategory } from "../../hooks/useCategory.ts";
interface categorySelectProps{
    value:string,
    onChange: ( description:string )=> void
}

function CategorySelect({ value,onChange }:categorySelectProps){
    const { data:categories, error, isError , isPending } = useCategory();
    if(isError){
        return(
            <option value={error.message}> </option>
        );
    };
    if(isPending){
        return ( <option value="Cargando..."></option> );
    };
    return(
        <select className="hover:bg-zinc-800 rounded-3xl p-1" value={value} onChange={(e)=>onChange(e.target.value)}>
            <option value="">-Opcion-</option>
            {categories.map((c)=> (
                <option key={c.id} value={c.description}>{c.description}</option>
            ))}
        </select>
    )
};

export default CategorySelect;
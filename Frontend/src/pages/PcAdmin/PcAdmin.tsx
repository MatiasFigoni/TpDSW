import PcItemTableAdmin from "../../components/PcTableAdmin/PcItemTableAdmin.tsx";
import type { Computer } from "../../types/computer.class.ts";
import "./PcAdmin.css";
import Loading from "../../components/Loading/loading.tsx";
import Error from "../../components/Error/Error.tsx";
import { useState } from "react";
import CategorySelect from "../../components/CategorySelect/CategorySelect.tsx";
import { useCategoryId } from "../../hooks/useCategoryId.ts";
import { useComputers } from "../../hooks/useComputers.ts";
// import PcDescriptionAdmin from "../../components/PcDescriptionAdmin/PcDescriptionAdmin.tsx";

function PcAdmin() {
    const[nroPagina, setNroPagina] = useState<number>(0)
    const [category,setCategory] = useState<string>('');

    const { data:categoryId } = useCategoryId(category);   
    const { data:computerQuery, isPending, isError, error } = useComputers(categoryId)
    
    const handlerCategory = (description:string):void => {
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
    
    function handlerPage(e:React.MouseEvent<HTMLButtonElement>){
        if(e.currentTarget.id === 'Anterior' && nroPagina > 4 )
            setNroPagina(nroPagina-5);
        if(e.currentTarget.id === 'Siguiente')
            setNroPagina(nroPagina+5);
    }

    const filteredComputerList = computerQuery.slice(nroPagina,nroPagina+5);
    
    return (
        <section className="sm:m-16 m-4">
            <h1 className="text-3xl text-white font-medium">Panel administrador</h1>
            <div className="flex my-4 md:text-lg justify-center">
                    <div className="flex md:px-16 p-2 bg-zinc-900 gap-x-2 text-zinc-400 rounded-3xl border border-zinc-800">
                        <p className="m-2">Filtrar categoria:</p>
                        <CategorySelect value={category} onChange={handlerCategory} />
                    </div>
                </div>
            <div className="overflow-x-auto">
                <table className="bg-zinc-800 table-auto w-full text-white">
                    <thead>
                        <tr>
                            <th className="px-6 py-3">Nro</th>
                            <th className="px-6 py-3">Descripcion</th>
                            <th className="px-6 py-3">Categoria</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3">Accion</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredComputerList.map((c: Computer) => (
                            <PcItemTableAdmin key={c.pcNumber} computer={c}/>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-white p-2.5">
                <span className="px-2">Pagina {(nroPagina)/5}</span>
                <button type="button" className="mx-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md" id="Anterior" onClick={handlerPage}>Anterior</button>
                <button type="button" className="mx-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md" id="Siguiente" onClick={handlerPage}>Siguiente</button>
            </div>
        </section>
    );
};
export default PcAdmin;
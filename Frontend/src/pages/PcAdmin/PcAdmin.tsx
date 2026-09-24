import { useQuery } from "@tanstack/react-query";
import PcItemTableAdmin from "../../components/PcTableAdmin/PcItemTableAdmin.tsx";
import { fetchComputers } from "../../services/computer.services.ts";
import type { Computer } from "../../types/computer.class.ts";
import "./PcAdmin.css";
import Loading from "../../components/Loading/loading.tsx";
import Error from "../../components/Error/Error.tsx";
import { useState } from "react";
// import PcDescriptionAdmin from "../../components/PcDescriptionAdmin/PcDescriptionAdmin.tsx";

function PcAdmin() {
    const[nroPagina, setNroPagina] = useState<number>(0)
    const computerListQuery = useQuery({
        queryKey: ['computers-map'],
        queryFn: () => fetchComputers(),
    },);

    if (computerListQuery.isPending) {
        return (
            <Loading />
        );
    }
    
    if (computerListQuery.isError) {
        return (
            <Error error={computerListQuery.error.message} />
        );
    };
    
    function handlerPage(e:React.MouseEvent<HTMLButtonElement>){
        if(e.currentTarget.id === 'Anterior' && nroPagina > 4 )
            setNroPagina(nroPagina-5);
        if(e.currentTarget.id === 'Siguiente')
            setNroPagina(nroPagina+5);
    }

    const filteredComputerList = computerListQuery.data.slice(nroPagina,nroPagina+5);
    
    return (
        <section className="sm:m-16 m-4">
            <h1 className="text-3xl text-white font-medium">Panel administrador</h1>
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
import PcItemTableAdmin from "../../components/PcTableAdmin/PcItemTableAdmin.tsx";
import type { Computer } from "../../types/computer.class.ts";
import Loading from "../../components/Loading/loading.tsx";
import Error from "../../components/Error/Error.tsx";
import { useState } from "react";
import CategorySelect from "../../components/CategorySelect/CategorySelect.tsx";
import { usePaginatedComputers } from "../../hooks/hooksComputers.ts";
import { useCategoryId } from "../../hooks/hooksCategories.ts";
import { Link } from "react-router";

const PAGE_SIZE = 5;

function PcAdmin() {
    const [page, setPage] = useState<number>(1);
    const [category, setCategory] = useState<string>('');
    const { data: categoryId } = useCategoryId(category);
    const { data: response, isPending, isError, error } = usePaginatedComputers(page, PAGE_SIZE, categoryId);

    const handlerCategory = (name: string): void => {
        setCategory(name);
        setPage(1);
    };

    if (isPending) {
        return <Loading />;
    }

    if (isError) {
        if (error.message.toLocaleLowerCase().includes('no hay computadoras registradas')) {
            return (
                <div className="text-zinc-400 text-center mx-4 sm:mx-24 my-6 rounded-2xl border border-zinc-800 py-8 bg-zinc-900">
                    <h2 className="text-xl">No se encontraron computadoras</h2>
                    <p className="my-4">Puede agregar una nueva computadora para empezar.</p>
                    <Link to={"new"} className="mx-1 py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50">Agregar computadora</Link>
                </div>
            );
        }
        return <Error error={error.message} />;
    }

    const computers = response?.data ?? [];
    const meta = response?.meta ?? { page: 1, totalPages: 1, total: 0 };

    return (
        <section className="sm:m-16 m-4">
            <h1 className="text-3xl text-white font-medium">Panel administrador</h1>
            <div className="flex my-4 md:text-lg justify-center">
                <div className="not-md:w-full p-2 md:flex md:px-16 justify-center bg-zinc-900 gap-x-2 text-zinc-400 rounded-3xl border border-zinc-800">
                    <div className="flex justify-center not-sm:pb-2.5">
                        <p className="m-2">Filtrar categoria:</p>
                        <CategorySelect value={category} onChange={handlerCategory} />
                    </div>
                    <div className="flex items-center not-md:justify-center">
                        <Link to={"new"} className="mx-1 py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50">Agregar computadora</Link>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto pb-3.5">
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
                        {computers.map((c: Computer) => (
                            <PcItemTableAdmin key={c.pcNumber} computer={c} />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between text-white p-2.5">
                <span className="text-sm text-zinc-400">
                    Página {meta.page} de {meta.totalPages} ({meta.total} computadoras en total)
                </span>
                <div>
                    <button
                        type="button"
                        className="mx-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 rounded-md transition-colors"
                        disabled={meta.page <= 1}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    >
                        Anterior
                    </button>
                    <button
                        type="button"
                        className="mx-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 rounded-md transition-colors"
                        disabled={meta.page >= meta.totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </section>
    );
}
export default PcAdmin;
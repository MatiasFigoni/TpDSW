import { Link } from "react-router";
interface propError {
    error: string
}
function Error({ error }: propError) {
    return (
        <div className="flex flex-col items-center p-16 gap-6">
            <h2 className="text-zinc-100 text-3xl">Ha ocurrido un error</h2>
            <div className="w-xs sm:w-sm h-1 bg-red-500 rounded-full"></div>
            <p className="text-zinc-400 text-center">Error: {error}</p>
            <Link to={'/'} className=" bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm">Volver al inicio</Link>
        </div>
    );
};
export default Error;
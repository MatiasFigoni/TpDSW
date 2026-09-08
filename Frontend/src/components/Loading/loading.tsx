import { LoaderCircle } from "lucide-react";

function Loading() {
    return (
        <div className="flex flex-col items-center m-16 gap-4">
            <h2 className="flex justify-center items-center text-3xl text-zinc-100">
                <LoaderCircle className="animate-spin"/> <p className="pl-2">Cargando</p>
            </h2>
            <div className="w-xs sm:w-sm h-1 bg-blue-600"></div>
        </div>
    );
};
export default Loading;
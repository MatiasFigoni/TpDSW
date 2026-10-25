import { AlertCircle, ShieldCheck, User as UserIcon } from "lucide-react";
import { Link } from "react-router";
import type { Person } from "../../../types/person.class";

interface PropsUserValidation {
    user: Person | null;
}

function UserValidation({ user }: PropsUserValidation) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-blue-400" />
                Datos del titular
            </h3>

            {user ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
                    <div>
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-zinc-400">{user.email}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Sesión iniciada
                    </span>
                </div>
            ) : (
                <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-amber-300 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Requiere iniciar sesión
                        </p>
                        <p className="text-xs text-amber-200/80 mt-1">
                            Para registrar la reserva a tu nombre debés iniciar sesión en tu cuenta.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            to="/login"
                            className="px-4 py-2 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-all border border-white/10"
                        >
                            Registrarse
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
export default UserValidation;
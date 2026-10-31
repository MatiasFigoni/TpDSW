import { Link, Outlet } from "react-router";
import Header from "../components/header/header.tsx";
import Login from '../pages/Login/Login.tsx';
import { useAuth } from "../hooks/useAuth.ts";

function AdminLayout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
};

function AdminEntry() {
  const { user, accountType } = useAuth();

  if (!user || accountType !== "employee" || user.role !== 'admin') {
    
    return <Login accountType="employee" redirectTo="/admin"/>;
  }

  return <AdminLayout/>;
}

export function AdminDashboard() {
    return (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <h1 className="text-3xl font-semibold text-white">Panel de administrador</h1>
            <p className="mt-2 text-zinc-400">Seleccioná qué sección querés administrar.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <Link
                    to="/admin/TurnAdmin"
                    className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 transition-colors hover:border-blue-500 hover:bg-zinc-800 flex flex-col justify-between"
                >
                    <div>
                        <h2 className="text-xl font-semibold text-white">Turnos y Check-in</h2>
                        <p className="mt-2 text-zinc-400 text-sm">Control de asistencia en mostrador, check-in e historial de reservas.</p>
                    </div>
                    <span className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white text-center">
                        Ir a Turnos
                    </span>
                </Link>

                <Link
                    to="/admin/PcAdmin"
                    className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 transition-colors hover:border-indigo-500 hover:bg-zinc-800 flex flex-col justify-between"
                >
                    <div>
                        <h2 className="text-xl font-semibold text-white">Computadoras</h2>
                        <p className="mt-2 text-zinc-400 text-sm">Administrá las computadoras registradas y su mantenimiento.</p>
                    </div>
                    <span className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white text-center">
                        Ir a PcAdmin
                    </span>
                </Link>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Categorías</h2>
                        <p className="mt-2 text-zinc-400 text-sm">Administrá las categorías disponibles para las computadoras.</p>
                    </div>
                    <button
                        type="button"
                        disabled
                        className="mt-6 cursor-not-allowed rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-400"
                    >
                        Próximamente
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AdminEntry;

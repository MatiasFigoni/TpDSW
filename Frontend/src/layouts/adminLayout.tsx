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

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Link
                    to="/admin/PcAdmin"
                    className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 transition-colors hover:border-indigo-500 hover:bg-zinc-800"
                >
                    <h2 className="text-xl font-semibold text-white">Computadoras</h2>
                    <p className="mt-2 text-zinc-400">Administrá las computadoras registradas.</p>
                    <span className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                        Ir a PcAdmin
                    </span>
                </Link>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                    <h2 className="text-xl font-semibold text-white">Categorías</h2>
                    <p className="mt-2 text-zinc-400">Administrá las categorías disponibles para las computadoras.</p>
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
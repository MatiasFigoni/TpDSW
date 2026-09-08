import { Menu, X } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Inicio", to: "/" },
        { name: 'Equipos', to: '/PcMap'},
        {name: 'Nosotros', to: '/about'}
    ];
    return (
        <>
            <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo / Marca */}
                        <div className="shrink-0 font-bold text-xl tracking-wide text-indigo-400">
                            <Link to={'/'}>Player Start</Link>
                        </div>

                        {/* Menú de Escritorio (Oculto en pantallas pequeñas) */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.to}
                                    className="text-gray-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Botón Call To Action (Escritorio) */}
                            <div className="hidden md:block">
                                <Link
                                    to={"/"}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 mr-2 rounded-lg text-sm transition-colors"
                                >
                                    Reservar
                                </Link>
                            </div>
                        </div>

                        {/* Botón Menú Hamburguesa (Solo Móvil) */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="text-gray-400 hover:text-white hover:bg-slate-800 p-2 rounded-md focus:outline-none"
                                aria-controls="mobile-menu"
                                aria-expanded={isOpen}
                            >
                                <span className="sr-only">Abrir menú principal</span>
                                {/* Icono dinámico según el estado (renderiza el menu de hambuergesa y la cruz)*/}
                                {isOpen ? (
                                    <X/>
                                ) : (
                                    <Menu/>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú Desplegable Móvil */}
                {isOpen && (
                    <div className="md:hidden bg-slate-800 border-t border-slate-700" id="mobile-menu">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to={"/"}
                                onClick={() => setIsOpen(false)}
                                className="w-full text-center block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-base mt-4 transition-colors"
                            >
                                Reservar
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}

export default Header;
function About() {
    return (
        <section className="bg-zinc-950 p-5">
            <div className="flex flex-col text-zinc-100 items-center mb-16 ">
                <h2 className="text-3xl">Acerca de nosotros</h2>
                <div className="w-3xs md:w-sm h-1 bg-blue-600 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center ">
                <div>
                    <h3 className="mb-3 text-zinc-100 text-2xl">El tercer espacio que necesitabas.</h3>
                    <p className="mb-3 text-zinc-400">Player Start nació de una necesidad simple: encontrar un lugar fuera de casa u oficina con internet infalible, hardware que no te deje a medias y un ambiente que fomente tanto la concentración extrema como la diversión competitiva.</p>
                    <p className="mb-3 text-zinc-400">No somos un "ciber" de los 2000s, ni un coworking aburrido. Somos un híbrido. Ya sea que necesites renderizar un proyecto 3D pesado durante la mañana, o hacer squad con tus amigos en la noche, aquí tienes tu estación.</p>
                </div>
                <div className="text-zinc-400">
                    <img src="/ImageFrontPlayerStart.jpg" alt="Foto del frente del local" className='border-2 rounded-2xl border-zinc-500' />
                </div>
            </div>
        </section>
    )
};
export default About;
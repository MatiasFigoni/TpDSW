function PcMaintenance(){

	//Terminar de hacer el mantenimiento
    return(
        <>
            
					{/* <button
						type="button"
						className="mt-5 flex w-full items-center justify-between border-b border-zinc-800 py-3 text-left text-xl font-semibold hover:text-zinc-300"
						aria-expanded={isMaintenanceOpen}
						aria-controls="maintenance-fields"
						onClick={() => setIsMaintenanceOpen((open) => !open)}
					>
						<span>Seccion Mantenimiento</span>
						<ChevronDown size={20} className={`transition-transform ${isMaintenanceOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
					</button>
					

					<div id="maintenance-fields" className={`${isMaintenanceOpen ? 'flex' : 'hidden'} flex-col`}>
						<h4>Registrar Maintenimiento</h4>
						<label htmlFor="PcMaintenanceDescription" className={stylesTexts}>Descripcion</label>
						<input type="text" id="PcMaintenanceDescription" className={stylesCampForm} placeholder={computer.maintenance.description}
							{...register('PcMaintenanceDescription', {})} />

						<label htmlFor="PcMaintenanceStartDate" className={stylesTexts}>Fecha Inicio</label>
						<input type="date" id="PcMaintenanceStartDate" className={stylesCampForm} placeholder={formatDateForInput(computer.maintenance.start_date)}
							{...register('PcMaintenanceStartDate', {})} />

						<label htmlFor="PcMaintenanceEndDate" className={stylesTexts}>Fecha Fin</label>
						<input type="date" id="PcMaintenanceEndDate" className={stylesCampForm} placeholder={formatDateForInput(computer.maintenance.end_date)}
							{...register('PcMaintenanceEndDate', {})} />

						<label htmlFor="PcMaintenanceStatus" className={stylesTexts}>Estado</label>
						<select id="PcMaintenanceStatus" className={stylesCampForm} 
							{...register('PcMaintenanceStatus', {})}>
							<option value="Pendiente">Pendiente</option>
							<option value="En proceso">En proceso</option>
							<option value="Finalizado">Finalizado</option>
							<option value="Cancelado">Cancelado</option>
						</select>
					</div> */}

        </>
    )
};
export default PcMaintenance;
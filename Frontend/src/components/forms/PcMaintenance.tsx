import { useForm } from "react-hook-form";
import type { Maintenance } from "../../types/maintenance.class.ts";
interface FormMaintenance{
	MaintenanceDescription: string,
	MaintenanceStartDate: Date
	MaintenanceEndDate: Date,
	MaintenanceStatus: string,
}
interface PcMaintenanceProps{
	lastMaintenance: Maintenance,
}
function PcMaintenance({  }:PcMaintenanceProps){
	const { } = useForm<FormMaintenance>({
		defaultValues: {
		}
	})
	//Terminar de hacer el mantenimiento
    return(
        <>
            
					{/*

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
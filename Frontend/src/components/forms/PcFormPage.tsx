import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";
import CategorySelect from "../CategorySelect/CategorySelect.tsx";
import type { Computer } from "../../types/computer.class.ts";
import { useState } from "react";

export interface FormComputer {
	PcNumber: number,
	PcDescription: string,
	PcStatus: string,
	PcCategory: string,
}

interface PcModifyProps {
	mode: 'create' | 'edit';
	computer?: Computer;
	onDelete?: (pcNumber:string) => void;
	onSubmit: (values: FormComputer) => void;
	isSubmitting?: boolean;
	submitError?: string;
	submitSuccess?: boolean;
}

function PcFormPage({ computer, onSubmit, isSubmitting = false, submitError, submitSuccess = false, onDelete, mode }: PcModifyProps) {
    const stylesTexts = 'text-lg my-2';
    const stylesCampForm = 'bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 text-zinc-200 px-3 py-2';
	const [panelDelete,setpanelDelete] = useState<Boolean>(false);
	const [isDeleting,setIsDeleting] = useState<boolean>(false)
	const { register, handleSubmit, control } = useForm<FormComputer>({
		defaultValues: {
			PcNumber: computer?.pcNumber ?? 0,
			PcDescription: computer?.description ?? '',
			PcStatus: computer?.status ?? 'Disponible', 
			PcCategory: computer?.category.description ?? '',
		}
	});
	return (
		<section className="py-16 px-6 mx-auto">
			<div className="flex justify-center pb-4">
			<h1 className="text-white text-3xl w-2xl text-center pb-2 border-b border-zinc-800">Panel de Modificacion de Computadora</h1>
			</div>
			<div className="bg-zinc-900 p-5 rounded-2xl border-2 border-zinc-800">
				<form className="flex flex-col h-full md:w-2/3 text-white" onSubmit={handleSubmit(onSubmit)}>
					<h3 className={stylesTexts}>Numero de Pc</h3>
					<input type="text" id="PcNumber" className={stylesCampForm}
						{...register('PcNumber', { })} />

					<label htmlFor="PcDescription" className={stylesTexts}>Descripcion (Gpu + Cpu + Ram + Monitor)</label>
					<input type="text" id="PcDescription" className={stylesCampForm}
						{...register('PcDescription', {})} />

					<label htmlFor="PcStatus" className={stylesTexts}>Estado</label>
					<input type="text" id="PcStatus" readOnly className={stylesCampForm}
						{...register('PcStatus', { })} />

					<label htmlFor="PcCategory" className={stylesTexts}>Categoria</label>
					<div className="[&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-zinc-700 [&_select]:bg-zinc-950 [&_select]:px-3 [&_select]:py-2 [&_select]:text-zinc-100">
						<Controller name="PcCategory" control={control} render={({ field }) => (
							<CategorySelect value={field.value} onChange={field.onChange} />
						)} />
					</div>

					<div className="pt-6">
						<input type="submit" value={isSubmitting ? "Guardando..." : "Guardar"} disabled={isSubmitting} className="mx-1 py-1.5 px-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50" />
						{mode ==='edit' && <input type="button" value={isDeleting ? "Eliminando..." : "Eliminar"} onClick={()=>setpanelDelete(!panelDelete)} className="mx-1 py-1.5 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-sm transition-colors" />}
						<Link to={'/admin/PcAdmin'} className="mx-1 py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition-colors">Volver</Link>
					</div>
					{panelDelete && 
					<div role="confirm" className="mt-3 rounded-lg border border-yellow-800 bg-yellow-950 px-4 py-3 text-orange-300">Seguro desea eliminar la computadora? 
						<input type="button" value={isDeleting ? "Eliminando..." : "Eliminar"} className="mx-1 py-1.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-sm transition-colors" 
							onClick={()=>{
								setIsDeleting(true); 
								if(onDelete){ 
									onDelete(computer?.pcNumber.toString() ?? "")
								}}} /> 
					</div>}
					{submitError && <p role="alert" className="mt-3 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-red-300">{submitError}</p>}
					{submitSuccess && <p role="status" className="mt-3 rounded-lg border border-green-800 bg-green-950 px-4 py-3 text-green-300">La computadora se {mode ==='edit'? 'actualizó':'creo'} correctamente.</p>}
				</form>
			</div>
		</section>
	);
}

export default PcFormPage;

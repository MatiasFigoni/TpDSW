import { useNavigate, useParams } from "react-router";
import Error from "../Error/Error.tsx";
import Loading from "../Loading/loading.tsx";
import { useCategory } from "../../hooks/hooksCategories.ts";
import PcFormPage,  { type FormComputer } from "../forms/PcFormPage.tsx";
import { useComputerCreate, useComputerDelete, useComputerPcNumber, useComputerModify } from "../../hooks/hooksComputers.ts";
import { Computer, type CreateComputer } from "../../types/computer.class.ts";
import { useAuth } from "../../hooks/useAuth.ts";

function PcManagement() {
    const {user} = useAuth();
    
    const { id } = useParams();
    const isCreating = id ? false : true;
    const { data: computer, isPending, isError, error } = useComputerPcNumber(id??"",!isCreating);

    //(id!) Siempre va a recibir el parametro, sino lo redirige a la tabla de compus
    const navigate = useNavigate();
    const { data: categories } = useCategory();
    const createMutation = useComputerCreate();
    const modifyMutation = useComputerModify();
    const deleteMutation = useComputerDelete();

    const handleCreate = (values:FormComputer) =>{
        const category = categories?.find((item) => item.name === values.PcCategory);
        if (!category) return;
        const updatedComputer:CreateComputer = {
            category: category.id,
            description:values.PcDescription,
            pcNumber: values.PcNumber,
            status: values.PcStatus
        }
        const param = {computer:updatedComputer,role:user!.role}
        createMutation.mutate(param);
    }

    const handleDelete = (pcNumber:string):void => {
        deleteMutation.mutate({pcNumber:pcNumber,role:user!.role},{
            onSuccess: () => {
                navigate("/admin/PcAdmin");
            }
        })
    }

    const handleModify = (values: FormComputer): void => {
        const category = categories?.find((item) => item.name === values.PcCategory);
        if (!category) return;
        const updatedComputer = new Computer(
            computer!.id,
            category,
            values.PcDescription,
            values.PcNumber,
            values.PcStatus
        )
        const params = {computer:updatedComputer,role:user!.role}
        modifyMutation.mutate(params);
    };

    if(isCreating){
        return(
            <PcFormPage
            mode = 'create'
            onSubmit={handleCreate}
            isSubmitting={createMutation.isPending}
            submitError={createMutation.error?.message}
            submitSuccess={createMutation.isSuccess}
        />
        )
    }

    if (isError) {
        return (
            <Error error={error.message} />
        )
    }
    if (isPending) {
        return (
            <Loading />
        )
    }

    return (
        <PcFormPage
            mode = 'edit'
            computer={computer}
            onSubmit={handleModify}
            onDelete={handleDelete}
            isSubmitting={modifyMutation.isPending}
            submitError={modifyMutation.error?.message}
            submitSuccess={modifyMutation.isSuccess}
        />
    );
};
export default PcManagement;
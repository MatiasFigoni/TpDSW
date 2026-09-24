import { Link } from "react-router";
import type { Computer } from "../../types/computer.class.ts";

interface PcItemTableAdminProp {
    computer: Computer,
}

function PcItemTableAdmin({ computer }: PcItemTableAdminProp) {

    return (
        <tr className=" odd:bg-zinc-600 even:bg-zinc-700">
            <td className="py-3">{computer.pcNumber}</td>
            <td>{computer.description}</td>
            <td>{computer.category.description}</td>
            <td>{computer.status}</td>
            <td>
                <Link to={computer.pcNumber.toString()} className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition-colors">Editar</Link>
            </td>
        </tr>
    );
};
export default PcItemTableAdmin;
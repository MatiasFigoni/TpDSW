import { Outlet } from "react-router";
import Header from "../components/header/header.tsx";

function AdminLayout(){
    return(
        <>
            <Header/>
            <main>
                <Outlet/>
            </main>
        </>
    )
};

export default AdminLayout;
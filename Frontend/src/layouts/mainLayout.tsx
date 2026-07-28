import { Outlet } from "react-router";
import Header from "../components/header/Header.tsx";
import Highlight from "../components/Highlights/Highlights.tsx";

function MainLayout(){
    return(
        <>
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Highlight/>
        </>
    )
};

export default MainLayout;
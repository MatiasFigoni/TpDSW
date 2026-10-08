import Home from "./pages/home.tsx"
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/mainLayout.tsx";
import PcMap from "./pages/PcMap/PcMap.tsx";
import About from "./pages/About/About.tsx";
import PcAdmin from "./pages/PcAdmin/PcAdmin.tsx";
import AdminLayout from "./layouts/adminLayout.tsx";
import PcManagement from "./components/PcManagement/PcManagement.tsx";
import PcMaintenance from "./components/forms/PcMaintenance.tsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout/>}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About/>}/>
            <Route path="/PcMap" element={<PcMap/>}/>
          </Route>
          <Route path="/admin" element={<AdminLayout/>}>
            <Route path="/admin/PcAdmin" element={<PcAdmin/>}/>
            <Route path="/admin/PcAdmin/new" element={<PcManagement/>}/>
            <Route path="/admin/PcAdmin/:id" element={<PcManagement/>}/>
            <Route path="/admin/PcAdmin/:id/maintenance" element={<PcMaintenance/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
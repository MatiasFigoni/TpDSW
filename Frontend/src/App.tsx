import Home from "./pages/home.tsx"
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/mainLayout.tsx";
import PcMap from "./pages/PcMap/PcMap.tsx";
import About from "./pages/About/About.tsx";
import PcAdmin from "./pages/PcAdmin/PcAdmin.tsx";
import AdminEntry, {AdminDashboard} from "./layouts/adminLayout.tsx";
import PcManagement from "./components/PcManagement/PcManagement.tsx";
import Login from "./pages/Login/Login.tsx";
import AuthProvider from "./context/AuthProvider.tsx";
import { UserRegister } from "./pages/Register/register.tsx";
// import { useAuth } from "./hooks/useAuth.ts";
// import PcMaintenance from "./components/forms/PcMaintenance.tsx";

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout/>}>
              <Route index element={<Home />} />
              <Route path="/about" element={<About/>}/>
              <Route path="/PcMap" element={<PcMap/>}/>
              <Route path="/login" element={<Login accountType="client"/>}/>
              <Route path="/register" element={<UserRegister/>}/>
            </Route>
            <Route path="/admin" element={<AdminEntry/>}>
              <Route index element={<AdminDashboard/>}/>
              <Route path="/admin/PcAdmin" element={<PcAdmin/>}/>
              <Route path="/admin/PcAdmin/new" element={<PcManagement/>}/>
              <Route path="/admin/PcAdmin/:id" element={<PcManagement/>}/>
              {/* <Route path="/admin/PcAdmin/:id/maintenance" element={<PcMaintenance/>}/> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </>
    );
  }
  


export default App;
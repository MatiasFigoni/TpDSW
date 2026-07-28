import Home from "./pages/home.tsx"
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/mainLayout.tsx";
import PcMap from "./pages/PcMap.tsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout/>}>
            <Route path="/" element={<Home />} />
            <Route path="/PcMap" element={<PcMap/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
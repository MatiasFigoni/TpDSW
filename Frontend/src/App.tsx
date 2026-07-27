import { useQuery } from "@tanstack/react-query";
import { fetchComputers } from "./services/computerServices.ts";

import Header from "./components/header/header.tsx";

function App(){
  const computerListQuery = useQuery({
    queryKey:['computers'],
    queryFn: fetchComputers,

  },);

  if (computerListQuery.isPending)
    return (
      <div>
        Cargando...
      </div>);

  if (computerListQuery.isError)
    return (
      <div>
        Hubo un error... <br />
        Error: {computerListQuery.error.message}
      </div>);

  return (
    <>
    <Header />
    </>
  );
}

export default App;
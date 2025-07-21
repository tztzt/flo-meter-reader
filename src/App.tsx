import { Route, Routes } from "react-router-dom";
import { routes } from "@/routes";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto">
      <NavBar />
      <div className="flex-1 content-center">
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={routes[0].element} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

import { routes } from "@/routes";
import { NavLink } from "react-router-dom";
import Logo from "@/assets/logo.svg?react";

export const NavBar = () => {
  return (
    <header className="sticky top-0 w-full bg-flo-bg-1 shadow-sm z-[100] min-h-[80px]">
      <nav className="relative shadow-lg h-full px-4 md:px-[45px] py-4">
        <div className="flex items-center gap-6 md:gap-12 font-medium text-white">
          <div className="text-flo-logo text-sm mb-4 md:mb-0">
            <Logo />
          </div>
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              end
              className={({ isActive }) =>
                `text-lg md:text-xl transition-colors ${
                  isActive ? "underline" : ""
                }`
              }
            >
              {route.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

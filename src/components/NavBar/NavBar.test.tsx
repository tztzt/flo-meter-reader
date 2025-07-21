import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NavBar } from "./";

// Mock logo component
vi.mock("@/assets/logo.svg?react", () => ({
  default: () => <div data-testid="logo">Mock Logo</div>,
}));

// Mock routes
vi.mock("@/routes", async () => {
  return {
    routes: [
      { path: "/", name: "Home", element: <div>Home Page</div> },
      { path: "/about", name: "About", element: <div>About Page</div> },
    ],
  };
});

describe("NavBar", () => {
  it("renders the logo and all nav links", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByTestId("logo")).toBeDefined();
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("About")).toBeDefined();
  });

  it("applies the active class to the current route", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <Routes>
          <Route path="*" element={<NavBar />} />
        </Routes>
      </MemoryRouter>
    );

    const aboutLink = screen.getByText("About");
    const homeLink = screen.getByText("Home");

    expect(aboutLink.className).toMatch(
      "text-lg md:text-xl transition-colors underline"
    );
    expect(homeLink.className).toMatch("text-lg md:text-xl transition-colors");
  });
});

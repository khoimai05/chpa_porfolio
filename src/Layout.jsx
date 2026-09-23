import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Cursor from "./Cursor.jsx";

export default function Layout() {
  const loc = useLocation();
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("theme") !== "light";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const t = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, [dark]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  return (
    <>
      <Cursor />
      <nav className="nav" aria-label="Site">
        <NavLink className="nav-brand" to="/">
          Anh Cao
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/experience">Experience</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/resume">Resume</NavLink>
          <button type="button" onClick={() => setDark((d) => !d)}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </nav>
      <div className="page" key={loc.pathname}>
        <Outlet />
      </div>
      {loc.pathname !== "/projects" && (
        <footer>
          <span className="sign">Anh Cao</span>
          <span>{loc.pathname === "/" ? "Home" : loc.pathname.slice(1)}</span>
        </footer>
      )}
    </>
  );
}

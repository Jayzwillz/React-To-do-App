import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const activeStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
  };

  return (
    <nav>
      <ul className="navbar">
        <li>
          <NavLink
            to="/"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/todos/1"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Todo Detail
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/error"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Error Page
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

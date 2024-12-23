import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const activeStyle = {
    fontWeight: "bold",
    backgroundColor: "blue",
  };

  // Style for the <nav> tag to make it sticky and handle layout
  const navbarStyle = {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#333",
    position: "sticky",
    top: 0,
    zIndex: 1000, // Ensures navbar stays on top
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Optional shadow for effect
  };

  // Style for <ul> element to manage list behavior and spacing
  const navbarListStyle = {
    display: "flex",
    listStyleType: "none",
    margin: 0,
    padding: 0,
  };

  // Style for each <li> element
  const navbarItemStyle = {
    padding: "15px",
  };

  // Default link style
  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
    padding: "10px",
  };

  // Hover effect for links
  const linkHoverStyle = {
    fontCol: "blue", // Adds background color when hovered
  };

  // Active link style
  const linkActiveStyle = {
    backgroundColor: "#444", // Adds background color when active
  };

  return (
    <nav style={navbarStyle}>
      <ul style={navbarListStyle}>
        <li style={navbarItemStyle}>
          <NavLink
            to="/"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Home
          </NavLink>
        </li>
        <li style={navbarItemStyle}>
          <NavLink
            to="/todos/1"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Todo Detail
          </NavLink>
        </li>
        <li style={navbarItemStyle}>
          <NavLink
            to="/error"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Error Page
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

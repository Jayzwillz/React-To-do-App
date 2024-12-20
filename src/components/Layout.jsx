import React from "react";

const Layout = ({ children }) => {
  return (
    <main role="main" aria-label="Main Content">
      {children}
    </main>
  );
};

export default Layout;

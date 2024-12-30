import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
      <div className="columns mt-6" style={{ minHeight: "100vh" }}>
        <div className="column has-background-light">
          <main className="container">{children}</main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;

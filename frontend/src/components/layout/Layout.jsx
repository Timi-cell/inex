import React from "react";
import "./Layout.scss";
import TopBar from "../topbar/Topbar";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <TopBar />
      <div className="children --mt1">{children}</div>
    </div>
  );
};

export default Layout;

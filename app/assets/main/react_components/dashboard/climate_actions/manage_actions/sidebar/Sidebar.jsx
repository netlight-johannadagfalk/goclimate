import React from "react";
import ReactDom from "react-dom";

const Sidebar = ({ children, sidebarCollapsed }) => {
  return ReactDom.createPortal(
    <>
      <div className={`${sidebarCollapsed ? "w-24" : "w-auto"}`}>
        {children}
      </div>
    </>,
    document.querySelector("#sidebar")
  );
};

export default Sidebar;

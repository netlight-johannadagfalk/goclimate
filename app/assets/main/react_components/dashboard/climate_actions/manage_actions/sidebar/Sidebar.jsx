import React from "react";
import ReactDom from "react-dom";
//import KanbanActionContainer from "../../kanban/KanbanActionContainer.jsx";

const Sidebar = ({ children, collapsed }) => {
  return ReactDom.createPortal(
    <>
      <div>{children}</div>
    </>,
    document.querySelector("#sidebar")
  );
};

export default Sidebar;

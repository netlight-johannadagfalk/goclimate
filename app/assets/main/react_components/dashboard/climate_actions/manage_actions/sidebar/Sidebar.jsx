import React from "react";
import ReactDom from "react-dom";
//import KanbanActionContainer from "../../kanban/KanbanActionContainer.jsx";

const Sidebar = ({ children, collapsed }) => {
  //const [collapsed, setCollapsed] = useState(false);

  return ReactDom.createPortal(
    <>
      <div className={`${collapsed ? "w-28" : "w-auto"}`}>{children}</div>
    </>,
    document.querySelector("#sidebar")
  );
};

export default Sidebar;

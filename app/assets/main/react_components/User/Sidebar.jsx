import React, { useState } from "react";
import ReactDom from "react-dom";
import KanbanActionContainer from "./KanbanActionContainer.jsx";

const Sidebar = ({ categories }) => {
  const [collapsed, setCollapsed] = useState(false);

  return ReactDom.createPortal(
    <>
      <div className={`${collapsed ? "w-28" : "w-auto"}`}>
        <KanbanActionContainer
          setCollapsed={setCollapsed}
          collapsed={collapsed}
          categories={categories}
        />
      </div>
    </>,
    document.querySelector("#sidebar")
  );
};

export default Sidebar;

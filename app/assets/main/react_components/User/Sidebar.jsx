import React, { useState } from "react";
import KanbanActionContainer from "./KanbanActionContainer.jsx";

const Sidebar = ({ categories }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div
        className={`bg-white h-screen right-0 top-20 fixed z-40 border-l border-gray-accent ${
          collapsed ? "w-28" : "w-auto"
        }`}
      >
        <div className={` ${collapsed ? "visible" : "visible"}`}>
          <KanbanActionContainer
            setCollapsed={setCollapsed}
            collapsed={collapsed}
            categories={categories}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useState } from "react";
import KanbanActionContainer from "./KanbanActionContainer.jsx";

const Sidebar = ({ categories }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className={` ${collapsed ? "w-28" : "w-auto"}`}>
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

import React, { useState } from "react";
import KanbanActionContainer from "./KanbanActionContainer.jsx";

const Sidebar = ({ climateActionCategories, actionsWithoutUserActions }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div
        className={`bg-white h-screen right-0 top-20 fixed z-40 border-l border-gray-accent ${
          collapsed ? "w-28" : "w-auto"
        }`}
      >
        <button
          className={`fas rounded-full h-12 w-12 bg-white border border-gray-accent -ml-6 m-auto absolute bottom-1/2 focus:outline-none ${
            collapsed ? "fa-chevron-left" : "fa-chevron-right"
          }`}
          onClick={() => setCollapsed(!collapsed)}
        ></button>

        <div className={` ${collapsed ? "visible" : "visible"}`}>
          <KanbanActionContainer
            collapsed={collapsed}
            climateActionCategories={climateActionCategories}
            actionsWithoutUserActions={actionsWithoutUserActions}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

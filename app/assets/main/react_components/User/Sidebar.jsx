import React, { useState } from "react";
import KanbanActionContainer from "./KanbanActionContainer.jsx";

const Sidebar = ({
  setLocalAccepted,
  columns,
  setColumns,
  setTotUserActions,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div
        className={`bg-white h-screen right-0 top-20 fixed z-40 border-l border-gray-accent ${
          collapsed ? "w-10" : "w-auto"
        }`}
      >
        <button
          className={`fas rounded-full h-12 w-12 bg-white border border-gray-accent -ml-6 m-auto absolute bottom-1/2 ${
            collapsed ? "fa-chevron-left" : "fa-chevron-right"
          }`}
          onClick={() => setCollapsed(!collapsed)}
        ></button>

        <div className={` ${collapsed ? "invisible" : "visible"}`}>
          <KanbanActionContainer
            setLocalAccepted={setLocalAccepted}
            columns={columns}
            setColumns={setColumns}
            setTotUserActions={setTotUserActions}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

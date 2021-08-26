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
          className={`fas static m-2 top-0 right-10 text-l ${
            collapsed ? "fa-arrow-alt-circle-left" : "fa-arrow-alt-circle-right"
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

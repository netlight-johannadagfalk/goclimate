import React, { useState } from "react";
import SidebarSecion from "./SidebarSection.jsx";
import KanbanActionContainer from "./KanbanActionContainer.jsx";

const Sidebar = (setLocalAccepted, columns, setColumns, setTotUserActions) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div
        className={`bg-white h-screen right-0 top-20 fixed z-40 border-l border-gray-accent ${
          collapsed ? "w-10" : "w-9/12"
        }`}
      >
        <button
          className={`fas static m-2 top-0 right-10 text-l ${
            collapsed ? "fa-arrow-alt-circle-left" : "fa-arrow-alt-circle-right"
          }`}
          onClick={() => setCollapsed(!collapsed)}
        ></button>

        <div
          className={`flex flex-col h-full justify-center ${
            collapsed ? "invisible" : "visible"
          }`}
        >
          <KanbanActionContainer
            setLocalAccepted={setLocalAccepted}
            columns={columns}
            setColumns={setColumns}
            setTotUserActions={setTotUserActions}
          />
          {/* <SidebarSecion title={"My Actions"}></SidebarSecion>
          <SidebarSecion title={"Achievements"}></SidebarSecion> */}

          {/* <div className="flex-1 h-full justify-center">
          <h4 className="text-base font-bold text-center">My Actions</h4>
        </div>
        <div className="flex-1 h-full justify-center border-t border-gray-accent pt-5">
          <h4 className="text-base font-bold text-center">My Badges</h4>
        </div> */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

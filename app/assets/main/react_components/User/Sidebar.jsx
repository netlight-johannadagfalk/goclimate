import React, { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <div
        className={`bg-white h-screen right-0 top-20 fixed z-200 border-l-2 border-gray-accent ${
          collapsed ? "w-10" : "w-80"
        }`}
      >
        <button
          className={`fas static m-2 top-0 right-10 text-xl z-100 ${
            collapsed ? "fa-arrow-alt-circle-left" : "fa-arrow-alt-circle-right"
          }`}
          onClick={() => setCollapsed(!collapsed)}
        ></button>
        <div
          className={`flex flex-col h-full justify-center ${
            collapsed ? "invisible" : "visible"
          }`}
        >
          <div className="flex-1 h-full justify-center">
            <h3 className="heading text-center">My Actions</h3>
          </div>
          <div className="flex-1 h-full justify-center border-t-2 border-gray-accent pt-5">
            <h3 className="heading text-center">My Badges</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

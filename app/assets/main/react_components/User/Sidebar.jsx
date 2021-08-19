import React, { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div>
      <div
        className={`callout h-screen right-0 top-20 fixed ${
          collapsed ? "w-5" : "w-60"
        }`}
      ></div>
      <button
        className="fas fa-bars fixed m-2 top-20 right-10"
        onClick={() => setCollapsed(!collapsed)}
      ></button>
    </div>
  );
};

export default Sidebar;

import React from "react";

const KanbanCardImage = ({ img, sidebarCollapsed, isUserAction }) => {
  return (
    <div
      className={`h-16 w-16 items-center flex flex-1 rounded-full bg-cover mx-auto z-10 ${
        isUserAction && "shadow"
      } ${sidebarCollapsed ? "justify-center" : "absolute ml-3 mt-2"}`}
      style={{
        backgroundImage: `url('${img}')`,
        backgroundSize: "100%",
      }}
    ></div>
  );
};

export default KanbanCardImage;

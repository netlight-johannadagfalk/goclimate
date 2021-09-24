import React from "react";

const CardImage = ({ img, sidebarCollapsed }) => {
  return (
    <div
      className={`shadow h-16 w-16 items-center flex flex-1 rounded-full bg-cover mx-auto z-10 mt-2 ${
        sidebarCollapsed ? "justify-center" : "absolute ml-3"
      }`}
      style={{
        backgroundImage: `url('${img}')`,
        backgroundSize: "100%",
      }}
    ></div>
  );
};

export default CardImage;

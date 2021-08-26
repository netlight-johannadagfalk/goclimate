import React from "react";

const SidebarSection = (title) => {
  console.log(title);

  return (
    <>
      <div className="flex flex-col h-full justify-center">
        <h4 className="text-base font-bold text-center">Title</h4>
        <div className="h-full justify-center"></div>
      </div>
    </>
  );
};

export default SidebarSection;

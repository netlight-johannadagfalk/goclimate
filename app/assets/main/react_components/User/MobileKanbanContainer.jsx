import React from "react";
import KanbanActionContainer from "./KanbanActionContainer.jsx";

const MobileKanbanContainer = ({ categories }) => {
  return (
    <>
      <div className="top-20 fixed z-50 bg-white w-full h-full bg-white overflow-hidden">
        <KanbanActionContainer categories={categories} />
      </div>
    </>
  );
};

export default MobileKanbanContainer;

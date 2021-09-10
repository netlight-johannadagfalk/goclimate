import React from "react";
import KanbanActionContainer from "./KanbanActionContainer.jsx";

const MobileKanbanContainer = ({ categories }) => {
  return (
    <>
      {/* <div className="flex-grow"> */}
      {/**Prevent background site from scrolling */}
      <div className="h-screen">
        <div className="top-20 fixed z-50 bg-white w-full h-full bg-white overflow-hidden">
          {/* <div className="absolute -z-10 top-0 left-0 right-0 bottom-0 overflow-y-auto d:overflow-y-visible pt-20 d:static d:z-0 d:pt-0"> */}
          {/* <div className="fixed z-50 top-20 bg-white left-0 w-full h-full right-0 bottom-0 overflow-hidden"> */}
          {/* <div className="justify-between items-center px-4 pb-8 t:px-8 text-center space-y-8 transform origin-top scale-y-90 toggler-checked:scale-y-100 opacity-0 toggler-checked:opacity-100 transition duration-500 ease-in-out"> */}
          <KanbanActionContainer categories={categories} />
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
    </>
  );
};

export default MobileKanbanContainer;

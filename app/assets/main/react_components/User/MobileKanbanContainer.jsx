import React from "react";
import KanbanActionContainer from "./KanbanActionContainer.jsx";
import { useMediaQuery } from "react-responsive";

const MobileKanbanContainer = ({ categories, clicked }) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <>
      {/* <div className="flex-grow"> */}
      {/**Prevent background site from scrolling */}
      {isTabletOrMobile && clicked && (
        // <div className="transition duration-75 ease-in opacity-0">
        <div className="top-20 fixed z-50 bg-white w-full h-full overflow-hidden">
          {/* <div className="absolute -z-10 top-0 left-0 right-0 bottom-0 overflow-y-auto pt-20"> */}
          {/* <div className="justify-between items-center px-4 pb-8 t:px-8 text-center space-y-8 transform origin-top scale-y-90 toggler-checked:scale-y-100 opacity-0 toggler-checked:opacity-100 transition duration-500 ease-in-out"> */}
          <KanbanActionContainer categories={categories} />
        </div>
        // </div>
        // </div>
        // </div>
      )}
      {/* </div> */}
      {/* </div> */}
    </>
  );
};

export default MobileKanbanContainer;

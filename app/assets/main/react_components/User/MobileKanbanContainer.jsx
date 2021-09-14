import React from "react";
import KanbanActionContainer from "./KanbanActionContainer.jsx";
import { useMediaQuery } from "react-responsive";

const MobileKanbanContainer = ({ categories }) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <>
      <input type="checkbox" id="mobileKanban" className="toggler" />
      <div className="fixed top-20 z-30 bg-white w-full overflow-hidden h-0 toggler-checked:h-screen transition-size duration-500">
        <KanbanActionContainer categories={categories} />
      </div>

      {/**Prevent background site from scrolling */}
      {isTabletOrMobile && (
        <label
          htmlFor="mobileKanban"
          className="fixed top-0 right-0 mr-20 mt-6 lg:mr-48 lg:right-10 t:mr-17 t:right-3 z-50"
        >
          <i className={`fas fa-2x ${"fa-globe-americas"}`}></i>
        </label>
      )}
    </>
  );
};

export default MobileKanbanContainer;

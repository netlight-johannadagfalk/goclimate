import React from "react";
import KanbanActionContainer from "./KanbanActionContainer.jsx";
import { useMediaQuery } from "react-responsive";

const MobileKanbanContainer = ({ categories }) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <>
      {/**Prevent background site from scrolling */}
      {isTabletOrMobile && (
        // <div className="top-20 fixed bg-white w-full h-full overflow-hidden">
        //   {/* <div className="top-20 fixed bg-white w-full h-full overflow-hidden"></div> */}
        //   <KanbanActionContainer categories={categories} />
        // </div>
        <div className="w-full fixed z-50">
          {/* <input type="checkbox" id="nav-toggler" className="toggler" /> */}
          <div className="relative z-0 overflow-visible h-20 toggler-checked:h-screen d:max-h-20 transition-size duration-500 ease-in-out bg-white">
            <nav className="p-4 t:px-8 h-20 flex items-center space-x-4 bg-white">
              <div className="flex-grow d:flex items-center d:space-x-8">
                <div className="flex-grow">
                  <div className="d:h-full absolute -z-10 top-0 left-0 right-0 bottom-0 overflow-y-auto d:overflow-y-visible pt-20 d:static d:z-0 d:pt-0">
                    <div className="d:h-full d:flex justify-between items-center px-4 pb-8 t:px-8 d:p-0 text-center space-y-8 d:space-y-0 transform origin-top scale-y-90 d:scale-y-100 toggler-checked:scale-y-100 opacity-0 d:opacity-100 d:transform-0 toggler-checked:opacity-100 transition d:transition-none duration-500 ease-in-out">
                      {/* <ul className="space-y-4 d:flex d:space-x-6 d:space-y-0"> */}
                      <KanbanActionContainer categories={categories} />
                      {/* </ul> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* <label htmlFor="nav-toggler" className="d:hidden">
                <div className="fixed top-0 right-0 mr-20 mt-6 lg:mr-48 lg:right-10 t:mr-17 t:right-3 z-50">
                  <i className="fas fa-2x fa-globe-americas"></i>
                </div>
              </label> */}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileKanbanContainer;

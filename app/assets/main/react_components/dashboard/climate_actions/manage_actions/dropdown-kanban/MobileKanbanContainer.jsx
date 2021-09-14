import React, { useState } from "react";

const MobileKanbanContainer = ({ climateActions, children }) => {
  const getTotalAmountOfAcceptedActionsForUser = () => {
    let amountActionsAccepted = 0;
    climateActions.map((action) => {
      if (action.accepted === true) {
        amountActionsAccepted++;
      }
    });
    return amountActionsAccepted;
  };

  const [showMobileKanban, setShowMobileKanban] = useState(false);

  // const setChecked = () => {
  //   setShowMobileKanban(!showMobileKanban);
  // };

  return (
    <>
      <div
        className={`fixed top-20 z-30 bg-white w-full overflow-hidden ${
          showMobileKanban ? "h-screen" : "h-0"
        } transition-size duration-500`}
      >
        {children}
      </div>
      <button
        className="fixed top-0 right-0 mr-20 mt-6 lg:mr-48 lg:right-10 t:mr-17 t:right-3 z-50"
        onClick={() => setShowMobileKanban(!showMobileKanban)}
      >
        <i
          className={`fas fa-2x ${
            showMobileKanban ? "fa-globe-europe" : "fa-globe-americas"
          }`}
        ></i>
        <div className="fas rounded-full h-5 w-5 bg-green-tint-2 border border-gray-accent -mt-1 -ml-3 absolute focus:outline-none">
          <div className="mb-2 text-white text-center">
            {getTotalAmountOfAcceptedActionsForUser()}
          </div>
        </div>
      </button>
    </>
  );

  // return (
  //   <>
  //     <input type="checkbox" id="mobileKanban" className="toggler" />
  //     <div className="fixed top-20 z-30 bg-white w-full overflow-hidden h-0 toggler-checked:h-screen transition-size duration-500">
  //       <KanbanActionContainer categories={categories} />
  //     </div>
  //     <label
  //       htmlFor="mobileKanban"
  //       className="fixed top-0 right-0 mr-20 mt-6 lg:mr-48 lg:right-10 t:mr-17 t:right-3 z-50"
  //     >
  //       <i
  //         className={`fas fa-2x ${
  //           showMobileKanban ? "fa-globe-europe" : "fa-globe-americas"
  //         }`}
  //         onClick={setChecked}
  //       ></i>
  //       <div className="fas rounded-full h-5 w-5 bg-green-tint-2 border border-gray-accent -mt-1 -ml-3 absolute focus:outline-none">
  //         <div className="mb-2 text-white text-center">
  //           {getTotalAmountOfAcceptedActionsForUser()}
  //         </div>
  //       </div>
  //     </label>
  //   </>
  // );
};

export default MobileKanbanContainer;

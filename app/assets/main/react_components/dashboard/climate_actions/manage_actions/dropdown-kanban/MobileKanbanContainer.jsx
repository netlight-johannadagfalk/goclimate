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
        className="fixed top-0 right-0 mr-20 mt-6 lg:mr-48 lg:right-10 t:mr-17 t:right-3 z-50 outline-none 
        focus:outline-none"
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
};

export default MobileKanbanContainer;

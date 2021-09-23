import React from "react";

import {
  useMobileKanban,
  useMobileKanbanUpdate,
} from "../../../../contexts/MobileKanbanContext.js";

const MobileKanbanContainer = ({ children, userActions }) => {
  const showMobileKanban = useMobileKanban();
  const setShowMobileKanban = useMobileKanbanUpdate();

  const getAcceptedActionsForUser = () => {
    let actionsAccepted = 0;
    userActions.map((action) => {
      if (action.status === false) {
        actionsAccepted++;
      }
    });
    return actionsAccepted;
  };

  const toggleScroll = (bool) => {
    const scrollable = document.getElementById("scrollable");
    bool
      ? (scrollable.className += " overflow-hidden")
      : (scrollable.className -= " overflow-hidden");
  };

  showMobileKanban ? toggleScroll(true) : toggleScroll(false);

  return (
    <div id="mobile-kanban">
      {showMobileKanban &&
        (document.getElementById("nav-toggler").checked = false)}
      <div
        className={`fixed top-16 z-30 bg-white w-full overflow-hidden ${
          showMobileKanban ? "h-screen" : "h-0"
        } transition-size duration-500`}
      >
        {children}
      </div>
      <button
        className="fixed top-0 right-0 mr-20 mt-4 t:mt-6 lg:mr-48 lg:right-10 t:mr-17 t:right-3 z-50 outline-none 
        focus:outline-none"
        onClick={() => setShowMobileKanban(!showMobileKanban)}
      >
        <i
          className={`fas fa-2x ${
            showMobileKanban ? "fa-globe-europe" : "fa-globe-americas"
          }`}
        ></i>

        {getAcceptedActionsForUser() > 0 && (
          <div className="fas rounded-full h-5 w-5 bg-green-tint-3 -mt-1 -ml-3 absolute focus:outline-none">
            <div className="mb-2 text-white text-center">
              {getAcceptedActionsForUser()}
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default MobileKanbanContainer;

import React, { useState, useEffect } from "react";

const DropDownKanbanContainer = ({ children, userActions }) => {
  const [showDropDownKanban, setShowDropDownKanban] = useState(false);

  const acceptedActionsForUser = userActions.reduce(
    (noOfAccepted, userAction) => {
      if (userAction.status === false) {
        noOfAccepted++;
      }
      return noOfAccepted;
    },
    0
  );

  const toggleScroll = (bool) => {
    const scrollable = document.getElementById("scrollable");
    bool
      ? (scrollable.className += " overflow-hidden")
      : (scrollable.className -= " overflow-hidden");
  };

  useEffect(() => {
    const toggleDropDownKanban = () => setShowDropDownKanban(false);
    const dropDownMenu = document.getElementById("nav-toggler");
    dropDownMenu.addEventListener("input", toggleDropDownKanban);
    return () =>
      dropDownMenu.removeEventListener("input", toggleDropDownKanban);
  }, []);

  showDropDownKanban &&
    (document.getElementById("nav-toggler").checked = false);
  showDropDownKanban ? toggleScroll(true) : toggleScroll(false);

  return (
    <div>
      <div
        className={`fixed top-16 z-30 bg-white w-full overflow-hidden ${
          showDropDownKanban ? "h-screen" : "h-0"
        } transition-size duration-500`}
      >
        {children}
      </div>
      <button
        className="fixed top-0 right-0 mr-20 mt-4 z-50 focus:outline-none t:mt-6 lg:mr-48 lg:right-10 t:mr-17 t:right-3"
        onClick={() => setShowDropDownKanban(!showDropDownKanban)}
      >
        <i
          className={`fas fa-2x ${
            showDropDownKanban ? "fa-globe-europe" : "fa-globe-americas"
          }`}
        ></i>
        {acceptedActionsForUser > 0 && (
          <div className="fas rounded-full h-5 w-5 bg-green-tint-3 -mt-1 -ml-3 absolute mb-2 text-white text-center focus:outline-none">
            {acceptedActionsForUser}
          </div>
        )}
      </button>
    </div>
  );
};

export default DropDownKanbanContainer;

import React, { useState, useEffect } from "react";

const MobileKanbanContainer = ({ children, acceptedActions }) => {
  const [ping, setPing] = useState(false);

  useEffect(() => {
    setPing(true);
    const timer = setTimeout(() => {
      setPing(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [acceptedActions]);

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
        <div
          className={`fas ${
            ping && "ping"
          } rounded-full h-5 w-5 bg-green-tint-3 -mt-1 -ml-3 absolute focus:outline-none`}
        >
          <div className="mb-2 text-white text-center">{acceptedActions}</div>
        </div>
      </button>
    </>
  );
};

export default MobileKanbanContainer;

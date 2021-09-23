import React, { useState, useEffect } from "react";
import {
  useMobileKanban,
  useMobileKanbanUpdate,
} from "../contexts/MobileKanbanContext.js";

const Helper = () => {
  const showMobileKanban = useMobileKanban();
  const setShowMobileKanban = useMobileKanbanUpdate();
  const [run, setRun] = useState(
    document.getElementById("nav-toggler").checked
  );

  useEffect(() => {
    setRun(document.getElementById("nav-toggler").checked);
    console.log({ run });
    return () => {};
  }, [document.getElementById("nav-toggler").checked === true]);

  return <>{run && setShowMobileKanban(false)}</>;
};

export default Helper;

//   return (
//     <div htmlFor="nav-toggler toggler-checked:h-screen ">
//       <div> {setShowMobileKanban(false)}</div>
//     </div>

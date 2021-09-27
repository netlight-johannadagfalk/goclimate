import React from "react";
const NumberOfAccepted = ({
  startText,
  endText,
  action,
  disabled,
  currentAloneUser,
}) => {
  return (
    <div>
      <div className="flex flex-row justify-center mb-1">
        <label className="text-sm mr-1">{startText}</label>
        {!currentAloneUser && (
          <p className="text-sm text-yellow-accent">
            {disabled ? action.total - 1 : action.total}
          </p>
        )}
        <label className="text-sm ml-1">{endText}</label>
      </div>
    </div>
  );
};
export default NumberOfAccepted;

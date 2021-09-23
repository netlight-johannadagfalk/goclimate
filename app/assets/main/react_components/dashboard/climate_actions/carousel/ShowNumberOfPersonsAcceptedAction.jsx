import React from "react";
const ShowNumberOfPersonsAcceptedAction = ({
  startText,
  endText,
  action,
  disabled,
}) => {
  return (
    <div>
      <div className="flex flex-row justify-center mb-1">
        <label className="text-sm mr-1">{startText}</label>
        <p className="text-sm text-yellow-accent">
          {disabled ? action.total - 1 : action.total}
        </p>
        <label className="text-sm ml-1">{endText}</label>
      </div>
      {disabled && (
        <button
          className="button inline-block "
          disabled={disabled}
          style={{ color: "rgba(28, 70, 55)" }}
        >
          Accepted
        </button>
      )}
    </div>
  );
};
export default ShowNumberOfPersonsAcceptedAction;

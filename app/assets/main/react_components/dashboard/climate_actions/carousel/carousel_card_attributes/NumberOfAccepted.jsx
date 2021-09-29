import React from 'react';
import { useClimateActionsText } from '../../../../contexts/TextContext.js';

const NumberOfAccepted = ({
  startText,
  endText,
  action,
  disabled,
  isFirstToAccept,
}) => {
  const climateActionsText = useClimateActionsText();

  return (
    <div>
      <div className="flex flex-row justify-center mb-1">
        <label className="text-sm mr-1">{startText}</label>
        {!isFirstToAccept && (
          <p className="text-sm text-yellow-accent">
            {disabled ? action.total - 1 : action.total}
          </p>
        )}
        <label className="text-sm ml-1">{endText}</label>
      </div>
      {disabled && (
        <button
          className="button inline-block "
          disabled={disabled}
          style={{ color: 'rgba(28, 70, 55)' }}
        >
          {climateActionsText.accepted}
        </button>
      )}
    </div>
  );
};
export default NumberOfAccepted;

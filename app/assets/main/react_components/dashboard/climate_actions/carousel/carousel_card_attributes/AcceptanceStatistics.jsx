import React from "react";
import NumberOfAccepted from "./NumberOfAccepted.jsx";
import { useClimateActionsText } from "../../../../contexts/TextContext.js";

const AcceptanceStatistics = ({ action }) => {
  const climateActionsText = useClimateActionsText();

  return (
    <>
      {action.accepted && action.total > 1 ? (
        <NumberOfAccepted
          startText={climateActionsText.statistics_11}
          endText={climateActionsText.statistics_12}
          action={action}
          disabled={true}
          isFirstToAccept={false}
        />
      ) : action.accepted && action.total == 1 ? (
        <NumberOfAccepted
          startText={climateActionsText.statistics_21}
          endText={climateActionsText.statistics_22}
          action={action}
          disabled={true}
          isFirstToAccept={true}
        />
      ) : (
        <>
          {!action.accepted && action.total !== 0 ? (
            action.total > 1 ? (
              <NumberOfAccepted
                startText={climateActionsText.statistics_31}
                endText={climateActionsText.statistics_32}
                action={action}
                disabled={false}
                isFirstToAccept={false}
              />
            ) : (
              <NumberOfAccepted
                startText={climateActionsText.statistics_41}
                endText={climateActionsText.statistics_42}
                action={action}
                disabled={false}
                isFirstToAccept={false}
              />
            )
          ) : (
            <NumberOfAccepted
              startText={climateActionsText.statistics_51}
              endText={climateActionsText.statistics_52}
              action={action}
              disabled={false}
              isFirstToAccept={true}
            />
          )}
        </>
      )}
    </>
  );
};

export default AcceptanceStatistics;

import React from "react";
import NumberOfAccepted from "./NumberOfAccepted.jsx";

const AcceptanceStatistics = ({ action }) => {
  return (
    <>
      {action.accepted && action.total > 1 ? (
        <NumberOfAccepted
          startText={"You and"}
          endText={"more have:"}
          action={action}
          disabled={true}
          currentAloneUser={false}
        />
      ) : action.accepted && action.total == 1 ? (
        <NumberOfAccepted
          startText={"You have accepted"}
          endText={""}
          action={action}
          disabled={true}
          currentAloneUser={true}
        />
      ) : (
        <div>
          {!action.accepted && action.total !== 0 ? (
            action.total > 1 ? (
              <NumberOfAccepted
                startText={"Do as"}
                endText={"others:"}
                action={action}
                disabled={false}
                currentAloneUser={false}
              />
            ) : (
              <NumberOfAccepted
                startText={"Do as"}
                endText={"other"}
                action={action}
                disabled={false}
                currentAloneUser={false}
              />
            )
          ) : (
            <NumberOfAccepted
              startText={"Be the first one to:"}
              endText={""}
              action={action}
              disabled={false}
              currentAloneUser={true}
            />
          )}
        </div>
      )}
    </>
  );
};

export default AcceptanceStatistics;

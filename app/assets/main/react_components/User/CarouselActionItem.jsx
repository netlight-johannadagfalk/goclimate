import React from "react";

const CarouselActionItem = ({
  action,
  user,
  updateLocalAccepted,
  addAcceptedAction,
}) => {
  const currUser = JSON.parse(user);

  const handleClickAccepted = (action) => {
    updateLocalAccepted(action.id);
    updateAccepted(action);
  };
  //FUNCTION WHERE USER ACCEPT AN ACTION IN DB -> MOVES TO ACCEPTED
  const updateAccepted = (action) => {
    const actionID = action.id;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const URL = "/user_climate_actions";
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        climate_action_id: actionID,
        user_id: currUser.id,
        status: false,
      }),
    };

    fetch(URL, requestOptions)
      .then((res) => res.json())
      .then((json) => addAcceptedAction(action, json))
      .catch((e) => console.log(e));
  };
  return (
    <div
      className={
        action.action_of_the_month
          ? "callout border-8 shadow-none min-h-full p-2 ml-2 mr-2 flex justify-center"
          : "callout shadow-none min-h-full p-2 ml-2 mr-2 flex justify-center"
      }
    >
      <div className="flex flex-col">
        <div className="flex-1">
          <h4
            className="text-base font-bold justify-center"
            style={{ color: "rgba(28, 70, 55, var(--tw-text-opacity))" }}
          >
            {action.name.length > 25
              ? action.name.slice(0, 25) + "..."
              : action.name}
          </h4>
        </div>
        <div className="flex-1">
          <p>
            {action.description.length > 40
              ? action.description.slice(0, 40) + "..."
              : action.description}
          </p>
        </div>
        <div className="flex-1">
          <img src="earth.png" className=" flex"></img>
        </div>
        <div className="flex-1">
          {action.accepted ? (
            <button
              className="button inline-block "
              disabled={true}
              style={{ color: "rgba(28, 70, 55)" }}
            >
              Accepted
            </button>
          ) : (
            <button
              className="button button-cta inline-block "
              onClick={() => handleClickAccepted(action)}
            >
              Accept challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarouselActionItem;

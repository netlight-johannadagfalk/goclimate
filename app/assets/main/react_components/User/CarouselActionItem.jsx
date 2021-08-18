import React, { useState } from "react";

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
    updateLocalNrOfAccepted(action);
  };

  const test =[{id: 0, total: 0}, 
      {id: 1, total: 1}, 
      {id: 2, total: 2}, 
      {id: 3, total: 3},
      {id: 4, total: 4},
      {id: 5, total: 5},
      {id: 6, total: 6},
      {id: 7, total: 7},
      {id: 8, total: 8},
      {id: 9, total: 9},
      {id: 10, total: 10},]
  ;
  const [localNrOfAccepted, setLocalNrOfAccepted] = useState([    
    // ...nrOfAccepted,
  ]);

  const [testing, setTesting] = useState([
    ...test,
  ]);

  const updateLocalNrOfAccepted = (action) => {
    console.log(action)
    setTesting(
      // testing.find(element => element.id === action.id).total = + 1
    )
    setLocalNrOfAccepted(

      // console.log(localNrOfAccepted.find(element => element.id === actionID))
      // localNrOfAccepted.map((action) =>
      //   action.id === actionID
      //     ? { ...action, total: action.total + 1}
      //     : action
      // )
    )
  }

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
    <div className="callout shadow-none min-h-full p-2 ml-2 mr-2 flex justify-center">
      <div className="flex flex-col">
        <div className="flex-1">
          <h4
            className="text-base font-bold "
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
          <img src="earth.png" className="flex-1"></img>
        </div>
        <div className="flex-1 flex-none mb-1">
          {action.points ? (
            <label>
            Impact: {action.points} CO2
            </label>
          ) : (
            <label>
            Impact: unknown
            </label>
          )
          }
          </div>
        <div className="flex-1 flex-none mb-1">
          {testing ? (testing.find(element => element.id === action.id) ? testing.find(element => element.id === action.id).total : 0) : 'X'}
          &nbsp; people have accepted
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

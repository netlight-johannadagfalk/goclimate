import React from "react"


const CarouselActionItem= ({ action, setStatus, user, userActions }) => {
    const currUser = JSON.parse(user)
    
    console.log(action.accepted);

    const handleClick = (action) => {
        setStatus(action);
        setAccepted(action.id);
    }

    // implement delete function
    // conditionals action och styling

    //FUNCTION WHERE USER ACCEPT AN ACTION IN DB -> MOVES TO ACCEPTED 
    const setAccepted = (actionID) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        const URL = "/user_climate_actions";
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRF-Token": csrfToken,
              'Content-Type': 'application/json',
              
            },
            body: JSON.stringify({climate_action_id: actionID, user_id:currUser.id, status:false})
          };
          
          fetch(URL, requestOptions)
          .then(res => console.log(res.json()))
          .catch(e => console.log(e))
    }

    const gridStyle = {
        height: '350px',
        gridTemplateRows: '25px 40px 200px 60px',
    };

    return (
        <div className="callout shadow-none m-2 p-2 grid grid-cols-1 grid-rows-4 gap-1" style={gridStyle}>
            <div>
                <h3 className="text-base font-bold" style={{color: 'rgba(28, 70, 55, var(--tw-text-opacity))'}}>{action.name}</h3>
            </div>
            <div>
                <p>{action.description}</p>
            </div>
            <div>
                <img src='earth.png' width="50" height="10"></img>
            </div>
            <div>
                {action.accepted ? 
                <button className="button inline-block align-bottom" onClick={() => handleClick(action)} style={{color: 'rgba(28, 70, 55)'}}>Challenge accepted</button>
                :
                <button className="button button-cta inline-block align-bottom" onClick={() => handleClick(action)} /*style={{color: 'rgba(28, 70, 55)'}}*/>Accept challenge</button>
            }
            </div>
        </div>
    );
}

export default CarouselActionItem;
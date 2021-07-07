import React from "react"

const CarouselActionItem= ({ action, setStatus }) => {

    
    const handleClick = (action) => {
        setStatus(action);
    }

    return (
        <div className="callout m-2 p-2" style={{height:'350px'}}>
            <h3 className="text-base font-bold" style={{color: 'rgba(28, 70, 55, var(--tw-text-opacity))'}}>{action.name}</h3>
            <p>{action.description}</p>
            <img src='earth.png' width="50%"></img>
            <button className="button button-cta inline-block align-bottom" onClick={() => handleClick(action)}>Accept challenge</button>
        </div>
    );
}

export default CarouselActionItem;
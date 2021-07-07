import React from "react"

const CarouselActionItem= ({ action, setStatus }) => {

    
    const handleClick = (action) => {
        setStatus(action);
    }

    return (
        <div className="callout m-2 p-2 grid grid-flow-col grid-cols-1 grid-rows-4 gap-1" style={{height:'350px'}}>
            <div className="h-1">
                <h3 className="text-base font-bold" style={{color: 'rgba(28, 70, 55, var(--tw-text-opacity))'}}>{action.name}</h3>
            </div>
            <div>
                <p className="align-bottom">{action.description}</p>
            </div>
            <div>
                <img src='earth.png' width="50%"></img>
            </div>
            <div>
                <button className="button button-cta inline-block align-bottom" onClick={() => handleClick(action)}>Accept challenge</button>
            </div>
        </div>
    );
}

export default CarouselActionItem;
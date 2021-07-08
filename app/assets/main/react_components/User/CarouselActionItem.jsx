import React from "react"

const CarouselActionItem= ({ action, setStatus }) => {

    
    const handleClick = (action) => {
        setStatus(action);
    }

    const gridStyle = {
        height: '350px',

    };

    return (
        <div className="callout m-2 p-2 grid grid-cols-1 grid-rows-10 gap-1" style={{height:'350px'}}>
            <div className="row-span-1">
                <h3 className="text-base font-bold" style={{color: 'rgba(28, 70, 55, var(--tw-text-opacity))'}}>{action.name}</h3>
            </div>
            <div className="row-span-1">
                <p>{action.description}</p>
            </div>
            <div className="row-span-1">
                <img src='earth.png' width="50" height="10"></img>
            </div>
            <div className="row-span-1 row-end-10">
                <button className="button button-cta inline-block align-bottom" onClick={() => handleClick(action)}>Accept challenge</button>
            </div>
        </div>
    );
}

export default CarouselActionItem;
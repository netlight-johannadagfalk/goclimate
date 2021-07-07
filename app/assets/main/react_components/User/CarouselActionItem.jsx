import React from "react"

const CarouselActionItem= ({ action }) => {

    
    const handleClick = () => {
        console.log('accept challenge');
    }

    return (
        <div className="callout m-2 p-4">
            <h3 className="text-lg font-bold" style={{color: 'rgba(28, 70, 55, var(--tw-text-opacity))'}}>{action.name}</h3>
            <p>{action.description}</p>
            <img src='earth.png' width="50%"></img>
            <button className="button button-cta block m-lg:inline-block t:block d:inline-block" onClick={handleClick}>Accept challenge</button>
        </div>
    );
}

export default CarouselActionItem;
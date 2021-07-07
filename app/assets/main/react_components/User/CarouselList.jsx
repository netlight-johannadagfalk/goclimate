import React from "react"
// import Carousel from "react-elastic-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import CarouselActionItem from "./CarouselActionItem.jsx";

const CarouselList= ({ climateActions }) => {

    
    const handleClick = () => {
        console.log('click');
    }

    return (
        <div className="">

                <Carousel 
                    centerMode={true}
                    centerSlidePercentage={28}
                    showThumbs={false}
                    infiniteLoop={true}
                    showStatus={false}
                    showIndicators={false}
                    renderArrowPrev={(onClickHandler, hasPrev) =>
                        hasPrev && (
                            <button type="button" className="button border-none" onClick={onClickHandler}>
                             &lt;- 
                            </button>
                        )
                    }
                    renderArrowNext={(onClickHandler, hasNext) =>
                        hasNext && (
                            <button type="button" className="button border-none" onClick={onClickHandler}>
                             ->
                            </button>
                        )
                    }
                >
                {climateActions.map((action) =>
                <CarouselActionItem action={action} key={action.id}></CarouselActionItem>
                )}  
            </Carousel>         
        </div>
    );
}

export default CarouselList;
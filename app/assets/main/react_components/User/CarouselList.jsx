import React from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import CarouselActionItem from "./CarouselActionItem.jsx";

// Carousel resources
// https://github.com/leandrowd/react-responsive-carousel
// http://react-responsive-carousel.js.org/storybook/index.html?path=/story/01-basic--with-custom-status-arrows-and-indicators
// http://react-responsive-carousel.js.org/storybook/?path=/story/02-advanced--with-external-controls 

const CarouselList= ({ climateActions, setStatus }) => {


    return (
                <Carousel 
                    centerMode={true}
                    centerSlidePercentage={25}
                    showThumbs={false}
                    infiniteLoop={true}
                    showStatus={false}
                    showIndicators={false}
                    autoPlay={false}
                    renderArrowPrev={(onClickHandler, hasPrev) =>
                        hasPrev && (
                            <button type="button" className="button border-none float-left" onClick={onClickHandler} style={{position: 'absolute', top:'91%'}}>
                             &lt;- 
                            </button>
                        )
                    }
                    renderArrowNext={(onClickHandler, hasNext) =>
                        hasNext && (
                            <button type="button" className="button border-none float-right" onClick={onClickHandler}>
                             ->
                            </button>
                        )}>

                {climateActions.map((action) =>
                    <CarouselActionItem action={action} key={action.id} setStatus={setStatus}></CarouselActionItem>
                )}  

            </Carousel>     
                );
}

export default CarouselList;
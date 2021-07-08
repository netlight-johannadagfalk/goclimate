import React from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import CarouselActionItem from "./CarouselActionItem.jsx";

// Carousel resources
// https://github.com/leandrowd/react-responsive-carousel
// http://react-responsive-carousel.js.org/storybook/index.html?path=/story/01-basic--with-custom-status-arrows-and-indicators
// http://react-responsive-carousel.js.org/storybook/?path=/story/02-advanced--with-external-controls 

const CarouselList= ({ climateActions, setStatus, user, userActions }) => {

    const climateActionsUser = ([...climateActions]);

    // Create new list including 'accepted' status
    climateActionsUser.map(climateAction =>
        {userActions.map(userAction =>
            {if(climateAction.name === userAction.name)
                climateAction.accepted ? climateAction.accepted = false : climateAction.accepted = true;
                // uppdatera databas här
            })})

    console.log(climateActionsUser)

    // TODO: Bugg - ett par actions har blivit dubletter
    // TODO: Fixa så storlek på knapp är lika oavsett 'accepted'-status
    // TODO: Toggla 'accepted'-status när man klickar på knapp
    // TODO: Fixa objekt med 'accepted' i backend ist för frontend

    // Ta reda på vilka climate actions som är accepterade och sätt 'accepted = true' för dem
    // Eller be backend skapa objekt med rätt data


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

                {climateActionsUser.map((action) =>
                    <CarouselActionItem 
                        action={action} 
                        key={action.id}
                        accepted={action.accepted}
                        setStatus={setStatus} 
                        user={user}
                        userActions={userActions}
                        ></CarouselActionItem>
                )}  

            </Carousel>     
                );
}

export default CarouselList;
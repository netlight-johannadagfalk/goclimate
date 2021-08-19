import React from 'react'
import CarouselHeader from './CarouselHeader.jsx'
import CarouselList from './CarouselList.jsx'

const CarouselContainer = ({
  user,
  climateActionsUser,
  updateLocalAccepted,
  addAcceptedAction,
}) => {
  return (
    <>
      <CarouselHeader />
      <CarouselList
        user={user}
        climateActionsUser={climateActionsUser}
        updateLocalAccepted={updateLocalAccepted}
        addAcceptedAction={addAcceptedAction}
      ></CarouselList>
    </>
  )
}

export default CarouselContainer

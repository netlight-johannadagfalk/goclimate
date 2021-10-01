import React from 'react';
import CarouselCard from '../dashboard/climate_actions/carousel/CarouselCard.jsx';
import { useClimateActionsText } from '../contexts/TextContext.js';
import TextBanner from './TextBanner.jsx';

const MonthlyAction = ({ action, user, updateLocalAccepted, categories }) => {
  const climateActionsText = useClimateActionsText();
  const text = climateActionsText.monthly_action;
  return (
    <div className="w-64 ml-10 mt-11 relative">
      <div className="h-52 w-52 -top-4 left-9 bg-cover absolute">
        <TextBanner text={text} />
      </div>
      <CarouselCard
        action={action}
        key={action.id}
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        categories={categories}
        monthlyActionBanner={true}
      ></CarouselCard>
    </div>
  );
};

export default MonthlyAction;

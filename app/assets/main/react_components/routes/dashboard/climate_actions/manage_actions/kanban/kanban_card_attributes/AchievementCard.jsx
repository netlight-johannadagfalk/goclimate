import React from 'react';
import ProgressBar from './ProgressBar.jsx';
import AchievementCardExpanded from './AchievementCardExpanded.jsx';

const AchievementCard = ({ categories, achievement }) => {
  //läste något tips om att man bör, för att hålla DOM så rent som möjligt, undvika div-taggar i onödan
  return (
    <>
      <div className="h-20">
        <ProgressBar
          categories={categories}
          item={achievement}
          userActions={achievement.userActionsArray}
          actions={achievement.actionsArray}
        />
      </div>
      {achievement.expanded && (
        <AchievementCardExpanded
          achievement={achievement}
        ></AchievementCardExpanded>
      )}
    </>
  );
};

export default AchievementCard;

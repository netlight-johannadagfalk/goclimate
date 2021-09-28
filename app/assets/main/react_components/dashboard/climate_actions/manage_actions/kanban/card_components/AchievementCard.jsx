import React from "react";
import ProgressBar from "./ProgressBar.jsx";
import AchievementCardExpanded from "./AchievementCardExpanded.jsx";

const AchievementCard = ({
  categories,
  achievement,
  handleUncompleteAction,
}) => {
  return (
    <div>
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
          handleUncompleteAction={handleUncompleteAction}
        ></AchievementCardExpanded>
      )}
    </div>
  );
};

export default AchievementCard;

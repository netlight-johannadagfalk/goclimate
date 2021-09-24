import React from "react";
import ProgressBar from "./ProgressBar.jsx";
import AchievementCardExpanded from "./AchievementCardExpanded.jsx";
import CardImage from "./CardImage.jsx";

const AchievementCard = ({
  categories,
  achievement,
  sidebarCollapsed,
  handleUncompleteAction,
}) => {
  return (
    <div>
      <div className="h-20">
        <CardImage
          img={achievement.badge_image_url}
          sidebarCollapsed={sidebarCollapsed}
          isUserAction={false}
        ></CardImage>
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

import React from "react";
import ProgressBar from "./ProgressBar.jsx";
import AchievementCardExpanded from "./AchievementCardExpanded.jsx";
import KanbanCardImage from "./KanbanCardImage.jsx";

const AchievementCard = ({
  categories,
  achievement,
  sidebarCollapsed,
  handleUncompleteAction,
}) => {
  return (
    <div>
      <div className="h-20">
        <KanbanCardImage
          img={achievement.badge_image_url}
          sidebarCollapsed={sidebarCollapsed}
          isUserAction={false}
        ></KanbanCardImage>
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

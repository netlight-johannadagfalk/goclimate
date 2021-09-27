import React from "react";

const AchievementCardExpanded = ({ achievement, handleUncompleteAction }) => {
  const actions = [
    ...achievement.userActionsArray,
    ...achievement.actionsArray,
  ];

  return (
    <div>
      <div className="mb-4 mt-5 ml-7 mr-4">
        {/* Map through both arrays in categoryBadge. All actions in the category should be rendered in a list, but those userActions that are performed should be highlighted */}
        {actions.map((action) => {
          return (
            <div className="group flex items-center mt-1 mb-3" key={action.id}>
              <div
                className="mr-3 rounded-full h-6 w-6 bg-cover flex-initial"
                style={{
                  backgroundImage: action.status
                    ? "url('/achievement_images/AchievementStarActive.png')"
                    : "url('/achievement_images/AchievementStarInactive.png')",
                }}
              ></div>
              <div
                className={`flex-initial text-left text-sm ${
                  action.status ? "text-black" : "text-gray-accent"
                }`}
              >
                {action.name}
              </div>
              {action.status && action.id > 0 && (
                <button
                  className="d:opacity-0 d:group-hover:opacity-50 d:hover:!opacity-100 opacity-50 flex-1 text-right fas fa-trash-alt fa-sm"
                  onClick={() => handleUncompleteAction(action)}
                ></button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementCardExpanded;

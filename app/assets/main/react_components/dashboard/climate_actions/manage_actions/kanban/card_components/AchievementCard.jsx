import React from "react";
import ProgressBar from "../ProgressBar.jsx";

const AchievementCard = ({
  item,
  categories,
  collapsed,
  handleButtonPerformOnDrag,
}) => {
  return (
    <div>
      <div className="flex justify-center ml-6 -mt-4">
        <ProgressBar
          categories={categories}
          item={item}
          userActions={item.userActionsArray}
          actions={item.actionsArray}
        />
      </div>

      {item.expanded && !collapsed && (
        <div className="mb-4 ml-7 mr-4">
          <div>
            {/* Map through both arrays in categoryBadge. All actions in the category should be rendered in a list, but those userActions that are performed should be highlighted */}
            {item.userActionsArray.map((subitem) => {
              return (
                <div key={subitem.id}>
                  {subitem.status === true ? (
                    <div className="group flex items-center mt-1 mb-3">
                      <div
                        className="mr-3 rounded-full h-6 w-6 bg-cover flex-initial"
                        style={{
                          backgroundImage:
                            "url('/achievement_images/AchievementStarActive.png')",
                        }}
                      ></div>
                      <div
                        className={`flex-initial text-left text-sm
                                  `}
                      >
                        {subitem.name}
                      </div>
                      <button
                        className="d:opacity-0 d:group-hover:opacity-50 d:hover:!opacity-100 opacity-50 flex-1 text-lg text-right"
                        onClick={() =>
                          handleButtonPerformOnDrag(subitem, false)
                        }
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <div className="flex mt-1 mb-3">
                      <div
                        className="mr-3 rounded-full h-6 w-6 bg-cover flex-initial"
                        style={{
                          backgroundImage:
                            "url('/achievement_images/AchievementStarInactive.png')",
                        }}
                      ></div>
                      <div
                        className={`text-sm flex-inital text-left text-gray-accent
                                  `}
                      >
                        {subitem.name}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {item.actionsArray.map((subitem) => {
            return (
              <div key={subitem.id}>
                <div className="flex mt-1 mb-3">
                  <div
                    className="mr-3 rounded-full h-6 w-6 bg-cover flex-initial"
                    style={{
                      backgroundImage:
                        "url('/achievement_images/AchievementStarInactive.png')",
                    }}
                  ></div>
                  <div className="text-gray-accent text-sm flex-inital text-left">
                    {subitem.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AchievementCard;

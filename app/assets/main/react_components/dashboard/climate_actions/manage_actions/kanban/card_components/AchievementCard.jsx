import React from "react";
import ProgressBar from "../ProgressBar.jsx";

const AchievementCard = ({
  item,
  categories,
  collapsed,
  handleExpanded,
  handleButtonPerformOnDrag,
}) => {
  return (
    <div>
      {collapsed ? (
        <div className="flex flex-1 items-center justify-center shadow-md">
          <div
            className={`rounded-full h-16 w-16 bg-cover shadow-lg my-1`}
            style={{
              backgroundImage: `url('${item.badge_image_url}')`,
              backgroundSize: "100%",
            }}
          ></div>
        </div>
      ) : (
        <div
          className={`h-20 ${
            item.expanded && "w-full border-b border-b-gray-tint-2"
          }`}
        >
          <div
            className="flex flex-row h-auto"
            onClick={() => handleExpanded(item, !item.expanded)}
          >
            <div className="flex flex-1">
              <div
                className="mx-auto mt-2 rounded-full h-16 w-16 items-center justify-center bg-contain bg-center shadow-lg"
                style={{
                  backgroundImage: `url('${item.badge_image_url}')`,
                  backgroundSize: "100%",
                }}
              ></div>
            </div>
            <div className="flex flex-2 justify-start">
              <div className="flex flex-1 font-bold text-left mt-5 text-sm">
                {item.name}
              </div>
            </div>
            <div className="flex flex-1 justify-center items-start">
              <button
                className={`fas float-right focus:outline-none mt-12 ml-10 ${
                  item.expanded ? "fa-chevron-up" : "fa-chevron-down"
                }`}
                onClick={() => handleExpanded(item, !item.expanded)}
              ></button>
            </div>
          </div>
          <div className="flex justify-center ml-6 -mt-4">
            <ProgressBar
              categories={categories}
              item={item}
              userActions={item.userActionsArray}
              actions={item.actionsArray}
            />
          </div>
        </div>
      )}

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

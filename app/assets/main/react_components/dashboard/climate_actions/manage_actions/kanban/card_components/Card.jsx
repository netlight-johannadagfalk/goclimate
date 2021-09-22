import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import UserActionCard from "./UserActionCard.jsx";
import AchievementCard from "./AchievementCard.jsx";

const Card = ({
  item,
  index,
  handleDelete,
  handleCompleteAction,
  handleUncompleteAction,
  categories,
  sidebarCollapsed,
  handleExpanded,
}) => {
  const isAchievement = item.userActionsArray ? true : false;

  const categoryName = () => {
    for (let i = 0; i <= Object.keys(categories).length; i++) {
      if (isAchievement) return "";

      if (categories[i].id === item.climate_action_category_id) {
        return categories[i].name.toString();
      }
    }
    return "unknown";
  };

  const categoryColor = categoryName();

  useEffect(() => {
    handleExpanded(item, false);
  }, [sidebarCollapsed]);

  const setStyleWithoutReordering = (style, snapshot) => {
    /** Moving element from accepted column to achieved column */
    if (!snapshot.isDragging) {
      return {
        userSelect: "none",
        padding: 0,
        minHeight: "auto",
      };
    }
  };

  const setStyleWithReordering = (style) => {
    /** Moving element inside accepted column */
    return {
      userSelect: "none",
      padding: 0,
      minHeight: "auto",
      ...style,
    };
  };

  return (
    <Draggable
      key={item.id}
      draggableId={item.id}
      index={index}
      isDragDisabled={item.status !== false}
    >
      {(provided, snapshot) => {
        return (
          <div
            id="card"
            className={`rounded-lg h-20 p-0 space-y-3 pt-0 w-80 mb-2 focus:outline-none relative ${
              sidebarCollapsed
                ? "d:w-24"
                : "t:w-80 border border-gray-tint-2 mx-5"
            }
            
            ${item.expanded ? "h-auto" : "w-24"}`}
            // Unclear what all of this means - change, rename or add comments?
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={
              item.status === false
                ? setStyleWithReordering(provided.draggableProps.style)
                : setStyleWithoutReordering(
                    provided.draggableProps.style,
                    snapshot
                  )
            }
          >
            {sidebarCollapsed ? ( // Make own component?
              <div className="flex flex-1 items-center justify-center shadow-md">
                <div
                  className={`rounded-full h-16 w-16 bg-cover shadow-lg my-1`}
                  style={{
                    backgroundImage: `url('${
                      isAchievement ? item.badge_image_url : item.image_url
                    }')`,
                    backgroundSize: "100%",
                  }}
                ></div>
              </div>
            ) : (
              <div>
                <div
                  className={`h-20 ${
                    item.expanded && "w-full border-b border-b-gray-tint-2"
                  }`}
                >
                  <div
                    className="flex flex-row h-14 w-full top-0 mt-6 absolute justify-center"
                    onClick={() => handleExpanded(item, !item.expanded)}
                  >
                    <div className="flex flex-1 z-10">
                      <div
                        className="mx-auto rounded-full h-16 w-16 items-center justify-center bg-contain bg-center shadow-lg -mt-4"
                        style={{
                          backgroundImage: `url('${
                            isAchievement
                              ? item.badge_image_url
                              : item.image_url
                          }')`,
                          backgroundSize: "100%",
                        }}
                      ></div>
                    </div>
                    <div className="flex flex-2 justify-start">
                      <div
                        className={`flex flex-1 font-bold text-left text-sm mt-1.5 ${
                          isAchievement && "-mt-2"
                        }`}
                      >
                        {item.name}
                      </div>
                    </div>
                    <div className="flex flex-1 justify-center items-start">
                      <button
                        className={`fas float-right focus:outline-none mt-4 ml-4 ${
                          item.expanded ? "fa-chevron-up" : "fa-chevron-down"
                        }`}
                        onClick={() => handleExpanded(item, !item.expanded)}
                      ></button>
                    </div>
                  </div>
                </div>

                {isAchievement ? (
                  <AchievementCard
                    achievement={item}
                    index={index}
                    key={item.id}
                    handleDelete={handleDelete}
                    handleUncompleteAction={handleUncompleteAction}
                    categories={categories}
                    sidebarCollapsed={sidebarCollapsed}
                    handleExpanded={handleExpanded}
                    categoryColor={categoryColor}
                  ></AchievementCard>
                ) : (
                  <UserActionCard
                    userAction={item}
                    index={index}
                    key={item.id}
                    handleDelete={handleDelete}
                    handleCompleteAction={handleCompleteAction}
                    categories={categories}
                    sidebarCollapsed={sidebarCollapsed}
                    handleExpanded={handleExpanded}
                    categoryColor={categoryColor}
                  ></UserActionCard>
                )}
              </div>
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default Card;

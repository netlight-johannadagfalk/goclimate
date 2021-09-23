import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import UserActionCard from "./UserActionCard.jsx";
import AchievementCard from "./AchievementCard.jsx";
import ProgressBar from "../ProgressBar.jsx";

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
        minHeight: "auto",
      };
    }
  };

  const setStyleWithReordering = (style) => {
    /** Moving element inside accepted column */
    return {
      userSelect: "none",
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
            className={`rounded-lg h-20 space-y-3 w-80 mb-2 focus:outline-none relative ${
              sidebarCollapsed
                ? "d:w-24"
                : "t:w-80 border border-gray-tint-2 mx-5"
            }
            ${item.expanded && "h-auto"}`}
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
            <div>
              {!sidebarCollapsed && (
                <div
                  className={`${
                    "category_" +
                    categoryColor.toLowerCase().replace(/ /g, "_") +
                    "_active"
                  } h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60 top-0`}
                ></div>
              )}
              <div
                className={`shadow-lg h-16 w-16 items-center rounded-full bg-cover mx-auto ${
                  !sidebarCollapsed && "flex flex-1 ml-3 -mt-5"
                }`}
                style={{
                  backgroundImage: `url('${
                    isAchievement ? item.badge_image_url : item.image_url
                  }')`,
                  backgroundSize: "100%",
                }}
              ></div>
            </div>

            {!sidebarCollapsed && (
              <div>
                <div
                  className=" h-14 w-full top-0 mt-6 absolute justify-center"
                  onClick={() => handleExpanded(item, !item.expanded)}
                >
                  <div
                    className={`font-bold text-left text-sm mt-1.5 ml-20 ${
                      isAchievement && "-mt-2"
                    }`}
                  >
                    {item.name}
                  </div>

                  <button
                    className={`fas float-right focus:outline-none mr-4 ${
                      item.status === false && "-mt-3"
                    } ${item.expanded ? "fa-chevron-up" : "fa-chevron-down"} `}
                    onClick={() => handleExpanded(item, !item.expanded)}
                  ></button>
                  {isAchievement && (
                    <ProgressBar
                      categories={categories}
                      item={item}
                      userActions={item.userActionsArray}
                      actions={item.actionsArray}
                    />
                  )}
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

import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import UserActionCard from "./UserActionCard.jsx";
import CardImage from "./CardImage.jsx";
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
            className={`rounded-lg h-20 space-y-3 mb-2 focus:outline-none relative justify-center ${
              sidebarCollapsed
                ? "d:w-24"
                : "w-80 border border-gray-tint-2 mx-5"
            }
            ${item.expanded ? "h-auto" : "w-24"}`}
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
            {sidebarCollapsed ? (
              <CardImage
                img={isAchievement ? item.badge_image_url : item.image_url}
                sidebarCollapsed={sidebarCollapsed}
                isUserAction={isAchievement ? false : true}
              ></CardImage>
            ) : isAchievement ? (
              <AchievementCard
                categories={categories}
                achievement={item}
                sidebarCollapsed={sidebarCollapsed}
                handleUncompleteAction={handleUncompleteAction}
              ></AchievementCard>
            ) : (
              <UserActionCard
                categoryColor={categoryColor}
                userAction={item}
                handleDelete={handleDelete}
                handleCompleteAction={handleCompleteAction}
                sidebarCollapsed={sidebarCollapsed}
              ></UserActionCard>
            )}

            {!sidebarCollapsed && (
              <div>
                <div
                  className=" h-14 w-full top-0 mt-6 absolute justify-center"
                  onClick={() => handleExpanded(item, !item.expanded)}
                >
                  <button
                    className={`fas right-0 focus:outline-none mr-4 absolute ${
                      item.status === true ? "mt-1" : "mt-4"
                    } ${item.expanded ? "fa-chevron-up" : "fa-chevron-down"} `}
                    onClick={() => handleExpanded(item, !item.expanded)}
                  ></button>
                  <div
                    className={`font-bold text-left text-sm mt-1.5 ml-20 w-3/5 ${
                      isAchievement && "-mt-2"
                    }`}
                  >
                    {item.name}
                  </div>

                  {isAchievement && (
                    <ProgressBar
                      categories={categories}
                      item={item}
                      userActions={item.userActionsArray}
                      actions={item.actionsArray}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default Card;

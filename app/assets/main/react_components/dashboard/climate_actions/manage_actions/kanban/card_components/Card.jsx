import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import ActionCard from "./ActionCard.jsx";
import AchievementCard from "./AchievementCard.jsx";

const Card = ({
  item,
  index,
  handleDelete,
  handleButtonPerformOnDrag,
  categories,
  collapsed,
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
  }, [collapsed]);

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
  console.log("card");

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
            className={`rounded-lg p-0 space-y-3 pt-0 w-80 mb-2 focus:outline-none ${
              collapsed ? "d:w-24" : "t:w-80 border border-gray-tint-2 mx-5"
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
            {isAchievement ? (
              <AchievementCard
                item={item}
                index={index}
                key={item.id}
                handleDelete={handleDelete}
                handleButtonPerformOnDrag={handleButtonPerformOnDrag}
                categories={categories}
                collapsed={collapsed}
                handleExpanded={handleExpanded}
                categoryColor={categoryColor}
              ></AchievementCard>
            ) : (
              <ActionCard
                item={item}
                index={index}
                key={item.id}
                handleDelete={handleDelete}
                handleButtonPerformOnDrag={handleButtonPerformOnDrag}
                categories={categories}
                collapsed={collapsed}
                handleExpanded={handleExpanded}
                categoryColor={categoryColor}
              ></ActionCard>
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default Card;

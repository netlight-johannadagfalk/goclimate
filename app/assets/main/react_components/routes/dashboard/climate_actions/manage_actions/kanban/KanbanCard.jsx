import React, { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import UserActionCard from './kanban_card_attributes/UserActionCard.jsx';
import KanbanCardImage from './kanban_card_attributes/KanbanCardImage.jsx';
import AchievementCard from './kanban_card_attributes/AchievementCard.jsx';
import {
  categoryName,
  getCategoryColor
} from '../../../helpers/CategoryColorHelper.js';

const KanbanCard = ({
  item,
  index,
  handleDelete,
  categories,
  sidebarCollapsed,
  handleExpanded
}) => {
  const isAchievement = item.userActionsArray ? true : false;

  useEffect(() => {
    handleExpanded(item, false);
  }, [sidebarCollapsed]);

  const setStyleWithoutReordering = (style, snapshot) => {
    if (!snapshot.isDragging) {
      return {
        userSelect: 'none',
        padding: 0,
        minHeight: 'auto'
      };
    }
  };

  const setStyleWithReordering = (style) => {
    return {
      userSelect: 'none',
      padding: 0,
      minHeight: 'auto',
      ...style
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
            className={`group rounded-lg h-20 space-y-3 mb-2 focus:outline-none duration-500 transistion transform border border-gray-tint-2 ${
              sidebarCollapsed
                ? 'd:w-24 border-none ml-1'
                : 'w-72 d:w-auto mx-5'
            }
            ${item.expanded ? 'h-auto' : 'w-24'}`}
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
            <KanbanCardImage
              img={isAchievement ? item.badge_image_url : item.image_url}
              isUserAction={isAchievement ? false : true}
            ></KanbanCardImage>

            {!sidebarCollapsed && (
              <div>
                {isAchievement ? (
                  <AchievementCard
                    categories={categories}
                    achievement={item}
                    sidebarCollapsed={sidebarCollapsed}
                  ></AchievementCard>
                ) : (
                  <UserActionCard
                    categoryColor={categoryName(
                      categories,
                      item.climate_action_category_id,
                      isAchievement
                    )}
                    userAction={item}
                    handleDelete={handleDelete}
                    sidebarCollapsed={sidebarCollapsed}
                    categoryColorHover={getCategoryColor(
                      'category_' +
                        categoryName(
                          categories,
                          item.climate_action_category_id
                        )
                          .toLowerCase()
                          .replace(/ /g, '_') +
                        '_active'
                    )}
                  ></UserActionCard>
                )}
                <div
                  className="flex flex-row h-14 w-full top-0 mt-6 absolute justify-center focus:outline-none"
                  onClick={() => handleExpanded(item, !item.expanded)}
                >
                  <div
                    className={`flex-1 font-bold text-left text-sm mt-1.5 ml-20 mr-10 ${
                      isAchievement && '-mt-2'
                    }`}
                  >
                    {item.name}
                  </div>
                  <button
                    className={`flex-1 fas right-0 focus:outline-none mr-4 absolute ${
                      item.status === true ? 'mt-1' : 'mt-4'
                    } ${item.expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                  ></button>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default KanbanCard;

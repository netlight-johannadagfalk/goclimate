import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn.jsx';
import { useDeletedActionUpdate } from '../../../contexts/DeletedActionContext.js';
import { useUserState, useUserActions } from '../../../contexts/UserContext.js';
import { deleteUserAction } from '../../../helpers/DBRequests.js';
import { useMediaQuery } from 'react-responsive';
import { t } from '../../../constants';
import {
  onDragEnd,
  collectPerformedUserActions
} from '../../../helpers/KanbanHelper.js';

const KanbanContainer = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  categories
}) => {
  /* 
    kanske ändra lite ordning så hooks-grejer hamnar överst och sen övriga variabler
    exempelvis först state, sen ref, sen custom hooks, sen const, eller liknande
    useEffect bör enligt Micke-feedback ligga överst
  */
  const setDeletedAction = useDeletedActionUpdate();
  const { data: data } = useUserState();
  const {
    updateUserActions,
    updateColumns,
    updateColumnsWithFormat,
    updateAchievements,
    updateAchievementsOnMove
  } = useUserActions();

  const columns = data.columns; // kan detta läggas in som ett ytterligare destructuring-lager på rad 20?
  const [isHovering, setIsHovering] = useState(false);
  const mounted = useRef(false);
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${t})` });

  useEffect(() => {
    // kanske flytta upp hit?
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleExpanded = (item, value) => {
    // value känns ganska generellt, finns ett mer beskrivande ord? gäller nedan också
    const column = item.status === false ? 1 : 2;
    updateColumns({
      ...columns,
      [column]: {
        ...columns[column],
        items: getExpandable(columns[column], item, value)
      }
    });
  };

  const getExpandable = (column, item, value) => {
    return column.items.map((expandable) => {
      return expandable.id === item.id
        ? {
            ...expandable,
            expanded: value
          }
        : { ...expandable, expanded: false };
    });
  };

  const handleDelete = (userActionID, actionID) => {
    deleteUserAction(userActionID);
    let performedUserActions = collectPerformedUserActions(columns[2].items);
    updateLocalUserActions(
      columns[1].items.filter((item) => item.id.toString() !== userActionID),
      performedUserActions,
      columns[2].items,
      actionID
    );
  };

  const updateLocalUserActions = (
    updatedList,
    performed,
    destItems,
    deletedAction
  ) => {
    updateUserActions([...updatedList, ...performed]);
    updateColumnsWithFormat(updatedList, destItems);
    setDeletedAction(deletedAction);
  };

  return (
    <div
      className={`h-screen ${
        sidebarCollapsed ? 'w-24' : 'd:w-80'
      } transition-size duration-500`}
      /* 
        Kan ternary-grejerna läggas sist i className-listor "överallt"? 
        Skulle nog vara lättare att läsa
      */
    >
      <DragDropContext
        onDragEnd={(result) =>
          onDragEnd(
            result,
            mounted.current,
            columns,
            updateUserActions,
            updateColumns,
            updateAchievements,
            updateAchievementsOnMove
          )
        }
      >
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            className="text-center h-1/2 pb-24 -mb-10"
            key={columnId}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              className="h-10 mt-2"
              style={
                isTabletOrMobile || sidebarCollapsed ? {} : { width: '20rem' }
              }
            >
              <p
                className={`font-normal text-base text-primary text-lg text-center`}
              >
                {!sidebarCollapsed && column.name}
              </p>
            </div>
            <KanbanColumn
              column={column}
              columnId={columnId}
              key={columnId}
              handleDelete={handleDelete}
              categories={categories}
              setSidebarCollapsed={setSidebarCollapsed}
              sidebarCollapsed={sidebarCollapsed}
              isHovering={isHovering}
              handleExpanded={handleExpanded}
            />
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default KanbanContainer;

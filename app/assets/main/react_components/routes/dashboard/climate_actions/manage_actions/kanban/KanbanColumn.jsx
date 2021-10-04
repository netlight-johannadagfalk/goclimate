import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard.jsx';
import { useMediaQuery } from 'react-responsive';
import { t } from '../../../constants'; // Bör dessa mått kanske finna i config-filen? Eller vara baserade på config-måtten?
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useClimateActionsText } from '../../../contexts/TextContext.js';

const KanbanColumn = ({
  column,
  columnId,
  handleDelete,
  categories,
  setSidebarCollapsed,
  sidebarCollapsed,
  isHovering,
  handleExpanded
}) => {
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${t})` });
  const { mascot_1, mascot_2, empty_achievements_column } =
    useClimateActionsText(); // destructuring

  return (
    <div
      className={`h-full ${
        isTabletOrMobile &&
        'lg:flex lg:justify-evenly lg:justify-items-center flex justify-evenly justify-items-center'
      }`}
      key={columnId}
    >
      <Droppable
        column={column}
        droppableId={columnId}
        key={columnId}
        isDropDisabled={sidebarCollapsed}
      >
        {(provided, snapshot) => (
          <div
            className={`h-full overflow-x-hidden pt-1 d:flex d:items-stretch flex items-center flex-col inline-block w-full 
              ${
                isHovering || isTabletOrMobile
                  ? 'overflow-y-auto'
                  : 'overflow-y-hidden'
              }`}
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              background: snapshot.isDraggingOver ? 'GhostWhite' : 'white', // introducerar en ny färg till paletten, OK?
              width: '100%'
            }}
          >
            {!sidebarCollapsed && columnId == 1 && column.items.length == 0 && (
              <>
                {/* För att förhålla sig till deras tailwindanvändning: <p> får className italic för fontstyle */}
                <p
                  style={{
                    fontStyle: 'italic',
                    marginTop: '10%'
                  }}
                >
                  {mascot_1} <br />
                  {mascot_2}
                </p>
                <img
                  src="/Mascot.png"
                  width="100"
                  height="100"
                  className="flex self-center"
                />
              </>
            )}
            <TransitionGroup component={null}>
              {column.items.slice(0, column.items.length).map((item, index) => {
                return (
                  <CSSTransition
                    timeout={{
                      enter: 100,
                      exit: 500
                    }}
                    classNames="display"
                    key={item.id}
                  >
                    <KanbanCard
                      item={item}
                      index={index}
                      key={item.id}
                      handleDelete={handleDelete}
                      categories={categories}
                      sidebarCollapsed={sidebarCollapsed}
                      handleExpanded={handleExpanded}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
            {!sidebarCollapsed && columnId == 2 && column.items.length < 2 && (
              <p
                style={{
                  fontStyle: 'italic',
                  marginTop: '25%'
                }}
              >
                {empty_achievements_column}
              </p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {columnId === '1' && (
        <div>
          <hr
            style={{
              color: 'lightgrey'
            }}
          />
          {!isTabletOrMobile && (
            <button
              className={`fas rounded-full h-12 w-12 bg-white border border-gray-accent -left-6 -mt-6 absolute focus:outline-none ${
                sidebarCollapsed ? 'fa-chevron-left' : 'fa-chevron-right'
              }`}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;

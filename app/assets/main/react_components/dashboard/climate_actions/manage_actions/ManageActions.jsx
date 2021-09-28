import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar.jsx";
import DropDownKanbanContainer from "./dropdown-kanban/DropDownKanbanContainer.jsx";
import { useMediaQuery } from "react-responsive";
import KanbanActionContainer from "./kanban/KanbanActionContainer.jsx";
import { t } from "../../../constants";

const ManageActions = ({ categories }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${t})` });

  return (
    <>
      {!isTabletOrMobile && (
        <div className="w-full">
          <Sidebar categories={categories} sidebarCollapsed={sidebarCollapsed}>
            <KanbanActionContainer
              setSidebarCollapsed={setSidebarCollapsed}
              sidebarCollapsed={sidebarCollapsed}
              categories={categories}
            />
          </Sidebar>
        </div>
      )}
      {isTabletOrMobile && (
        <DropDownKanbanContainer>
          <KanbanActionContainer
            setSidebarCollapsed={setSidebarCollapsed}
            sidebarCollapsed={false}
            categories={categories}
          />
        </DropDownKanbanContainer>
      )}
    </>
  );
};

export default ManageActions;

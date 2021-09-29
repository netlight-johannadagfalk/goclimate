import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar.jsx";
import DropDownKanbanContainer from "./dropdown-kanban/DropDownKanbanContainer.jsx";
import { useMediaQuery } from "react-responsive";
import KanbanContainer from "./kanban/KanbanContainer.jsx";
import { t } from "../../../constants";

const ManageActions = ({ categories, userActions }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${t})` });

  return (
    <>
      {!isTabletOrMobile && (
        <Sidebar categories={categories} sidebarCollapsed={sidebarCollapsed}>
          <KanbanContainer
            setSidebarCollapsed={setSidebarCollapsed}
            sidebarCollapsed={sidebarCollapsed}
            categories={categories}
          />
        </Sidebar>
      )}
      {isTabletOrMobile && (
        <DropDownKanbanContainer userActions={userActions}>
          <KanbanContainer
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

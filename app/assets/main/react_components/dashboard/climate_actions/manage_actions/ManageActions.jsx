import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar.jsx";
import DropDownKanbanContainer from "./dropdown-kanban/DropDownKanbanContainer.jsx";
import { useMediaQuery } from "react-responsive";
import KanbanActionContainer from "./kanban/KanbanActionContainer.jsx";
import { t } from "../../../constants";

const ManageActions = ({ categories, userActions }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${t})` });

  return (
    <>
      {!isTabletOrMobile && (
        <div className="w-full">
          <Sidebar
            categories={categories}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          >
            <KanbanActionContainer
              setCollapsed={setCollapsed}
              collapsed={collapsed}
              categories={categories}
            />
          </Sidebar>
        </div>
      )}
      {isTabletOrMobile && (
        <DropDownKanbanContainer userActions={userActions}>
          <KanbanActionContainer
            setCollapsed={setCollapsed}
            collapsed={false}
            categories={categories}
          />
        </DropDownKanbanContainer>
      )}
    </>
  );
};

export default ManageActions;

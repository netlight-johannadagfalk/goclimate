import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar.jsx";
import MobileKanbanContainer from "./dropdown-kanban/MobileKanbanContainer.jsx";
import { useMediaQuery } from "react-responsive";
import KanbanActionContainer from "./kanban/KanbanActionContainer.jsx";
import { t } from "../../../constants";

const ManageActions = ({ categories, climateActions }) => {
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
        <MobileKanbanContainer climateActions={climateActions}>
          <KanbanActionContainer
            setCollapsed={setCollapsed}
            collapsed={false}
            categories={categories}
          />
        </MobileKanbanContainer>
      )}
    </>
  );
};

export default ManageActions;

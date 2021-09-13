import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar.jsx";
import { useMediaQuery } from "react-responsive";
import KanbanActionContainer from "./kanban/KanbanActionContainer.jsx";
import { d } from "../../../constants";

const ManageActions = ({ categories }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${d})` });

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
    </>
  );
};

export default ManageActions;

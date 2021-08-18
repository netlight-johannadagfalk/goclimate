import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { FaGem, FaHeart } from "react-icons/fa";

const Sidebar = () => {
  //   return <button className="fas fa-bars fixed m-2 top-20 right-0"></button>;
  const [collapsed, setCollapsed] = useState(true);

  const handleCollapse = () => {
    console.log("test");
  };

  return (
    <ProSidebar
      collapsed={collapsed}
      width="500px"
      className="fixed top-0 float-right h-full"
    >
      <Menu iconShape="square">
        <MenuItem icon={<FaGem />}>Dashboard</MenuItem>
        <SubMenu title="Components" icon={<FaHeart />}>
          <MenuItem>Component 1</MenuItem>
          <MenuItem>Component 2</MenuItem>
        </SubMenu>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`float-left m-4 fas ${
            collapsed ? "fa-chevron-left" : "fa-chevron-right"
          }`}
        ></button>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;

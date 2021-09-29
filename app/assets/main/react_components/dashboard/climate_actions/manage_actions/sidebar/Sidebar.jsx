import React from 'react';
import ReactDom from 'react-dom';

const Sidebar = ({ children }) => {
  return ReactDom.createPortal(
    <>
      <div>{children}</div>
    </>,
    document.querySelector('#sidebar')
  );
};

export default Sidebar;

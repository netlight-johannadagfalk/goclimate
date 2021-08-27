import React, { useState, useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const ColumnsContext = React.createContext();
const ColumnsUpdateContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useColumns = () => {
  return useContext(ColumnsContext);
};

export const useColumnsUpdate = () => {
  return useContext(ColumnsUpdateContext);
};

//***  To wrap components that need acces to the context in ***/
export const ColumnsProvider = ({ children }) => {
  const [columns, setCurrColumns] = useState(null);

  const updateColumns = (cat) => {
    setCurrColumns(cat);
  };

  return (
    <ColumnsContext.Provider value={columns}>
      <ColumnsUpdateContext.Provider value={updateColumns}>
        {children}
      </ColumnsUpdateContext.Provider>
    </ColumnsContext.Provider>
  );
};

import React, { useState, useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
const CategoryContext = React.createContext();
const CategoryUpdateContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useCategory = () => {
  return useContext(CategoryContext);
};

export const useCategoryUpdate = () => {
  return useContext(CategoryUpdateContext);
};

//***  To wrap components that need acces to the context in ***/
export const CategoryProvider = (props) => {
  const [currCategory, setCurrCategory] = useState(null);

  const updateCategory = (cat) => {
    setCurrCategory(cat);
  };

  return (
    <CategoryContext.Provider value={currCategory}>
      <CategoryUpdateContext.Provider value={updateCategory}>
        {props.children}
      </CategoryUpdateContext.Provider>
    </CategoryContext.Provider>
  );
};

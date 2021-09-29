import React, { useState, useContext } from "react";

const CategoryContext = React.createContext();
const CategoryUpdateContext = React.createContext();

export const useCategory = () => {
  return useContext(CategoryContext);
};

export const useCategoryUpdate = () => {
  return useContext(CategoryUpdateContext);
};

export const CategoryProvider = ({ children }) => {
  const [currCategory, setCurrCategory] = useState(null);

  return (
    <CategoryContext.Provider value={currCategory}>
      <CategoryUpdateContext.Provider value={setCurrCategory}>
        {children}
      </CategoryUpdateContext.Provider>
    </CategoryContext.Provider>
  );
};

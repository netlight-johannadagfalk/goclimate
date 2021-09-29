import React, { useState, useContext } from 'react';

const CategoryContext = React.createContext();
const CategoryUpdateContext = React.createContext();

export const useCategory = () => {
  return useContext(CategoryContext);
};

export const useCategoryUpdate = () => {
  return useContext(CategoryUpdateContext);
};

export const CategoryProvider = ({ children }) => {
  const [category, setCategory] = useState(null);

  return (
    <CategoryContext.Provider value={category}>
      <CategoryUpdateContext.Provider value={setCategory}>
        {children}
      </CategoryUpdateContext.Provider>
    </CategoryContext.Provider>
  );
};

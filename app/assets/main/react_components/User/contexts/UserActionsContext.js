import React, { useState, useContext } from "react";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
export const UserActionsContext = React.createContext();
export const UserActionsUpdateContext = React.createContext();
export const CategoryBadgesUpdateContext = React.createContext();
export const UserActionsColumnsContext = React.createContext();
export const UserActionsColumnsUpdateContext = React.createContext();
export const UserActionsColumnsWithFormatUpdateContext = React.createContext();
export const UserActionsColumnsWithFullFormatUpdeateContext =
  React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useUserActions = () => {
  return useContext(UserActionsContext);
};

export const useUserActionsUpdate = () => {
  return useContext(UserActionsUpdateContext);
};

export const useCategoryBadgesUpdate = () => {
  return useContext(CategoryBadgesUpdateContext);
};
export const useUserActionsColumns = () => {
  return useContext(UserActionsColumnsContext);
};
export const useUserActionsColumnsUpdate = () => {
  return useContext(UserActionsColumnsUpdateContext);
};
export const useUserActionsColumnsWithFormatUpdate = () => {
  return useContext(UserActionsColumnsWithFormatUpdateContext);
};

export const useUserActionsColumnsWithFullFormatUpdate = () => {
  return useContext(UserActionsColumnsWithFullFormatUpdeateContext);
};
//***  To wrap components that need acces to the context in ***/
export const UserActionsProvider = ({
  children,
  allUserActions,
  actionsWithoutUserActions,
  climateActionCategories,
}) => {
  const [userActions, setUserActions] = useState(allUserActions);

  const formatedUserActions = (inVal) => {
    return inVal.map((userActions) => ({
      ...userActions,
      id: userActions.id.toString(),
    }));
  };

  const acceptedUserActions = (inVal) => {
    return formatedUserActions(inVal)
      .filter((action) => action.status !== true)
      .map((action) => ({ ...action }));
  };
  // const doneUserActions = (inVal) => {
  //   return formatedUserActions(inVal)
  //     .filter((action) => action.status !== false)
  //     .map((action) => ({ ...action }));
  // };

  const columnUserActions = (acceptedList, doneList) => {
    return {
      [1]: {
        id: "Accepted",
        name: "Your accepted actions:",
        items: acceptedList,
      },
      [2]: {
        id: "Performed",
        name: "Your performed actions:",
        items: doneList,
      },
    };
  };

  const [categoryBadges, setCategoryBadges] = useState(
    getCorrectCategoriesWithPerformedActions
  );

  const updateCategoryBadges = (badge) => {
    setCategoryBadges(badge);
  };

  const updateUserActions = (actions) => {
    setUserActions(actions);
  };

  const updateColumns = (col) => {
    setColumns(col);
  };
  const updateColumnsWithFormat = (updatedList, performedList) => {
    setColumns(columnUserActions(updatedList, performedList));
  };
  const updateColumnsWithFullFormat = (col) => {
    setColumns(columnUserActions(acceptedUserActions(col), categoryBadges));
  };

  // new imports connected to badges

  const filterCategories = (filter, condition, status) => {
    return filter.filter(
      (filterUserAction) =>
        filterUserAction.climate_action_category_id === condition &&
        filterUserAction.status === status
    );
  };

  const filterCategoriesWithoutStatus = (filter, condition) => {
    return JSON.parse(filter).filter(
      (filterUserAction) =>
        filterUserAction.climate_action_category_id === condition
    );
  };

  const appendItemsArrayToCategory = JSON.parse(climateActionCategories)
    .map((category) => {
      const filtered = filterCategories(userActions, category.id, true);

      if (filtered.length !== 0) {
        return {
          ...category,
          itemsArray: filtered,
        };
      }
    })
    .filter((removed) => removed);

  const getCorrectCategoriesWithPerformedActions =
    appendItemsArrayToCategory.map((category) => {
      const secondMatching = filterCategoriesWithoutStatus(
        actionsWithoutUserActions,
        category.id
      );
      const thirdMatching = filterCategories(userActions, category.id, false);
      return {
        ...category,
        itemsArray: [
          ...category.itemsArray,
          ...secondMatching,
          ...thirdMatching,
        ],
        id: category.id.toString(),
      };
    });

  const [columns, setColumns] = useState(
    columnUserActions(
      acceptedUserActions(userActions),
      //doneUserActions(userActions)
      getCorrectCategoriesWithPerformedActions
    )
  );

  // const [columns, setColumns] = useState(
  //   columnUserActions(
  //     acceptedUserActions(totUserActions),
  //     getCorrectCategoriesWithPerformedActions
  //   )
  // );

  // ---------------------------

  return (
    <UserActionsContext.Provider value={userActions}>
      <UserActionsUpdateContext.Provider value={updateUserActions}>
        <UserActionsColumnsContext.Provider value={columns}>
          <UserActionsColumnsUpdateContext.Provider value={updateColumns}>
            <UserActionsColumnsWithFormatUpdateContext.Provider
              value={updateColumnsWithFormat}
            >
              <UserActionsColumnsWithFullFormatUpdeateContext.Provider
                value={updateColumnsWithFullFormat}
              >
                <CategoryBadgesUpdateContext.Provider
                  value={updateCategoryBadges}
                >
                  {children}
                </CategoryBadgesUpdateContext.Provider>
              </UserActionsColumnsWithFullFormatUpdeateContext.Provider>
            </UserActionsColumnsWithFormatUpdateContext.Provider>
          </UserActionsColumnsUpdateContext.Provider>
        </UserActionsColumnsContext.Provider>
      </UserActionsUpdateContext.Provider>
    </UserActionsContext.Provider>
  );
};

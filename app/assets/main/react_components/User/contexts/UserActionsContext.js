import React, { useState, useContext } from "react";
import { uniqWith } from "lodash";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
export const UserActionsContext = React.createContext();
export const UserActionsUpdateContext = React.createContext();
export const CategoryBadgesUpdateContext = React.createContext();
export const CategoryBadgesContext = React.createContext();
export const UserActionsColumnsContext = React.createContext();
export const UserActionsColumnsUpdateContext = React.createContext();
export const UserActionsColumnsWithFormatUpdateContext = React.createContext();
export const UserActionsColumnsWithFullFormatUpdeateContext =
  React.createContext();

export const CategoryBadgesUpdateOnDragContext = React.createContext();

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

export const useCategoryBadges = () => {
  return useContext(CategoryBadgesContext);
};

export const useCategoryBadgesUpdateOnDrag = () => {
  return useContext(CategoryBadgesUpdateOnDragContext);
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
  const updateColumnsWithFullFormat = (col, categoryBadges) => {
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

  const findCategory = (performedColumn, item) => {
    return performedColumn.find(
      (performedItem) => item.climate_action_category_id == performedItem.id
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

  const updateCategoryBadgesOnDrag = (item, performedColumn) => {
    const category = findCategory(performedColumn, item);
    /** If category bagde is already created in the perform column */
    if (category !== undefined) {
      const updatedItemsArray = category.itemsArray.map((action) =>
        action.id == item.id || action.id == item.climate_action_id
          ? { ...action, status: true }
          : action
      );

      const resultArray = performedColumn.map((performedCategory) => {
        return performedCategory.id === category.id
          ? { ...performedCategory, itemsArray: updatedItemsArray }
          : performedCategory;
      });
      return resultArray;
    } else {
      /** Creates a new category badge */
      const newCategory = JSON.parse(climateActionCategories).find(
        (cat) => cat.id === item.climate_action_category_id
      );
      const secondMatching = filterCategoriesWithoutStatus(
        actionsWithoutUserActions,
        newCategory.id
      );
      const thirdMatching = filterCategories(
        formatedUserActions(userActions),
        newCategory.id,
        false
      );

      const result = {
        ...newCategory,
        itemsArray: [...secondMatching, ...thirdMatching],
      };
      const updatedItemsArray = result.itemsArray.map((action) => {
        return action.id == item.id || action.id == item.climate_action_id
          ? { ...action, status: true }
          : action;
      });

      const updatedResult = {
        ...newCategory,
        itemsArray: updatedItemsArray,
        id: newCategory.id.toString(),
      };

      const resultArray = [...performedColumn, updatedResult];

      const filterDuplicates = (arrVal, othVal) => {
        console.log({ arrVal, item });
        if (arrVal.id !== item.id) {
          return arrVal.id === item.climate_action_id;
        } else {
          return arrVal.name === othVal.name;
        }
      };

      const newResultArray = resultArray.map((category) => {
        return {
          ...category,
          itemsArray: uniqWith(category.itemsArray, filterDuplicates),
        };
      });
      console.log({ newResultArray });

      return newResultArray;
    }
  };

  const [categoryBadges, setCategoryBadges] = useState(
    getCorrectCategoriesWithPerformedActions
  );
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
                <CategoryBadgesUpdateOnDragContext.Provider
                  value={updateCategoryBadgesOnDrag}
                >
                  <CategoryBadgesUpdateContext.Provider
                    value={updateCategoryBadges}
                  >
                    <CategoryBadgesContext.Provider value={categoryBadges}>
                      {children}
                    </CategoryBadgesContext.Provider>
                  </CategoryBadgesUpdateContext.Provider>
                </CategoryBadgesUpdateOnDragContext.Provider>
              </UserActionsColumnsWithFullFormatUpdeateContext.Provider>
            </UserActionsColumnsWithFormatUpdateContext.Provider>
          </UserActionsColumnsUpdateContext.Provider>
        </UserActionsColumnsContext.Provider>
      </UserActionsUpdateContext.Provider>
    </UserActionsContext.Provider>
  );
};

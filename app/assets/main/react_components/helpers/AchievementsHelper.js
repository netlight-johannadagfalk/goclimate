import { uniqWith } from "lodash";

const filterCategoryRelatedUserActions = (filter, condition, status) => {
  return filter.filter(
    (filterUserAction) =>
      filterUserAction.climate_action_category_id === condition &&
      filterUserAction.status === status
  );
};

const filterCategoryRelatedActions = (filter, condition) => {
  return filter.filter(
    (filterUserAction) =>
      filterUserAction.climate_action_category_id === condition
  );
};
const membershipAchievement = (userSubscriptionType) => {
  const res = {
    id: "-1",
    name: "Climate Friend",
    badge_image_url: "/achievement_images/AchievementClimateFriendShadow.png",
    userActionsArray: [
      { id: "-2", name: "GoClimate free membership", status: true },
      {
        id: "-3",
        name: "GoClimate paid membership",
        status: userSubscriptionType == true ? true : false,
      },
    ],
    actionsArray: [],
  };
  return res;
};

const findCategory = (achievementColumn, item) => {
  return achievementColumn.find(
    (performedAction) => item.climate_action_category_id == performedAction.id
  );
};

const appendUserActionsArrayToCategory = (
  climateActionCategories,
  userActions
) => {
  return climateActionCategories
    .map((category) => {
      const userPerformedActions = filterCategoryRelatedUserActions(
        userActions,
        category.id,
        true
      );
      if (userPerformedActions.length !== 0) {
        return {
          ...category,
          userActionsArray: userPerformedActions,
        };
      }
    })
    .filter((removed) => removed);
};

export const getCompleteCategoryArrays = (
  actionsWithoutUserActions,
  allUserActions,
  climateActionCategories,
  userSubscriptionType
) => {
  const userActions = allUserActions;
  const res = [
    ...appendUserActionsArrayToCategory(
      climateActionCategories,
      userActions
    ).map((category) => {
      const allActionsWithoutUserActions = filterCategoryRelatedActions(
        actionsWithoutUserActions,
        category.id
      );

      const allUserActions = filterCategoryRelatedUserActions(
        userActions,
        category.id,
        false
      );
      return {
        ...category,
        userActionsArray: [...category.userActionsArray, ...allUserActions],
        actionsArray: [...allActionsWithoutUserActions],
        id: category.id.toString(),
      };
    }),
    membershipAchievement(userSubscriptionType),
  ];
  return res;
};

export const handleAchievementsOnMove = (
  movedItem,
  achievementColumn,
  climateActionCategories,
  userActions,
  actionsWithoutUserActions,
  actionsWithUserActions,
  formatedUserActions
) => {
  const filterDuplicatesNames = (arrVal, othVal) => {
    return arrVal.name === othVal.name;
  };
  const category = findCategory(achievementColumn, movedItem);
  if (category !== undefined) {
    movedItem.status = true;
    const updatedUserItemsArray = category.userActionsArray.filter((action) => {
      return action.name != movedItem.name;
    });
    const updatedActionItemsArray = category.actionsArray.filter((action) => {
      return action.name != movedItem.name;
    });

    const resultArray = achievementColumn.map((performedCategory) => {
      return performedCategory.id === category.id
        ? {
            ...performedCategory,
            userActionsArray: [...updatedUserItemsArray, movedItem],
            actionsArray: updatedActionItemsArray,
          }
        : performedCategory;
    });
    return resultArray;
  } else {
    const newCategory = climateActionCategories.find(
      (cat) => cat.id === movedItem.climate_action_category_id
    );
    const allClimateActions = [
      ...filterCategoryRelatedActions(
        actionsWithoutUserActions,
        newCategory.id
      ),
      ...filterCategoryRelatedActions(actionsWithUserActions, newCategory.id),
    ];
    const allUserActions = [
      ...filterCategoryRelatedUserActions(
        formatedUserActions(userActions),
        newCategory.id,
        false
      ),
      ...filterCategoryRelatedUserActions(
        formatedUserActions(userActions),
        newCategory.id,
        true
      ),
    ];
    const result = {
      ...newCategory,
      actionsArray: [...allClimateActions],
      userActionsArray: [...allUserActions],
      id: newCategory.id.toString(),
    };
    const updatedUserActionsArray = result.userActionsArray.map((action) => {
      return action.id == movedItem.id ? { ...action, status: true } : action;
    });

    const updatedActionsArray = result.actionsArray.filter(
      (action) => action.id != movedItem.climate_action_id
    );

    const combinedActionsArray = [
      ...updatedUserActionsArray,
      ...updatedActionsArray,
    ];

    const newCombinedActionsArray = uniqWith(
      combinedActionsArray,
      filterDuplicatesNames
    );

    const updatedAchievements = {
      ...newCategory,
      userActionsArray: newCombinedActionsArray.filter(
        (userAction) => userAction.user_id
      ),
      actionsArray: newCombinedActionsArray.filter((action) => !action.user_id),
      id: newCategory.id.toString(),
    };
    const resultArray = [...achievementColumn, updatedAchievements];

    return resultArray;
  }
};

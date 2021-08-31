import React, { useState, useEffect } from "react";
import CarouselContainer from "./CarouselContainer.jsx";
import KanbanActionContainer from "./KanbanActionContainer.jsx";
import CarouselActionItem from "./CarouselActionItem.jsx";
import { stringify } from "postcss";

const ClimateActionsContainer = ({
  user,
  userActions,
  actionsWithUserActions,
  actionsWithoutUserActions,
  climateActionCategories,
}) => {
  const [totUserActions, setTotUserActions] = useState(JSON.parse(userActions));
  const [deletedAction, setDeletedAction] = useState(null);
  const [currCategory, setCurrCategory] = useState(null);

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction]);

  const addAcceptedAction = (action, userAction) => {
    setDeletedAction(null);
    const tempAction = {
      id: userAction.id,
      name: action.name,
      description: action.description,
      climate_action_id: action.id,
      status: userAction.status,
      user_id: userAction.user_id,
      climate_action_category_id: action.climate_action_category_id,
    };

    const localVar = [...totUserActions, tempAction];
    console.log("LOCALVAR: " + JSON.stringify(totUserActions));
    setTotUserActions(localVar);
    setColumns(
      columnUserActions(acceptedUserActions(localVar), categoryBadges)
    );
  };
  const doneUserActions = (inVal) => {
    return inVal.filter((category) => category.itemsArray !== undefined);
    //.map((action) => ({ ...action }));
  };

  const setLocalAccepted = (updatedList, performed, deletedAction) => {
    setTotUserActions([...updatedList, ...performed]);
    setColumns(columnUserActions(updatedList, performed));
    setDeletedAction(deletedAction);
  };
  //******************************************************* */

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

  const filterCategories = (filter, condition, status) => {
    return JSON.parse(filter).filter(
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
      };
    });

  const columnUserActions = (acceptedList, withItemsArray) => {
    return {
      [1]: {
        id: "Accepted",
        name: "Your accepted actions:",
        items: acceptedList,
      },
      [2]: {
        id: "Performed",
        name: "Your performed actions:",
        items: withItemsArray,
      },
    };
  };

  const [columns, setColumns] = useState(
    columnUserActions(
      acceptedUserActions(totUserActions),
      getCorrectCategoriesWithPerformedActions
    )
  );

  const [categoryBadges, setCategoryBadges] = useState(
    getCorrectCategoriesWithPerformedActions
  );
  //******************************************************* */

  const localActionsWithUserActions = JSON.parse(actionsWithUserActions).map(
    (action) => ({
      ...action,
      accepted: true,
    })
  );

  const localActionsWithoutUserActions = JSON.parse(
    actionsWithoutUserActions
  ).map((action) => ({
    ...action,
    accepted: false,
  }));

  const totClimateActions = [
    ...localActionsWithoutUserActions,
    ...localActionsWithUserActions,
  ];

  const [climateActionsUser, setClimateActionsUser] = useState([
    ...totClimateActions,
  ]);

  const updateLocalAccepted = (actionID) => {
    setClimateActionsUser(
      climateActionsUser.map((action) =>
        action.id === actionID
          ? { ...action, accepted: !action.accepted }
          : action
      )
    );
  };
  const monthlyAction = climateActionsUser.find(
    (action) => action.action_of_the_month === true
  );

  const setCategory = (cat) => {
    setCurrCategory(cat);
    const filteredActions = cat
      ? totClimateActions.filter(
          (temp) => temp.climate_action_category_id === cat
        )
      : totClimateActions;

    const filteredActionsWithStatus = filteredActions.map((x) => {
      return totUserActions.some((y) => y.climate_action_id === x.id)
        ? { ...x, accepted: true }
        : { ...x, accepted: false };
    });

    console.log("TOTUSERACTIONS: " + JSON.stringify(totUserActions));

    const filteredCategoriesWithStatus = totUserActions
      .filter((category) => category.itemsArray)
      .map((action) =>
        action.itemsArray.filter((item) => item.status === true)
      );
    //.filter((action) => action.itemsArray.status === true);

    console.log("FILTEREDACTIONS " + JSON.stringify(filteredActionsWithStatus));

    const finalFilter = filteredActionsWithStatus.map((action) => {
      return filteredCategoriesWithStatus.some(
        (actionPerformed) =>
          action.id === actionPerformed.id ||
          action.id === actionPerformed.climate_action_id
      )
        ? { ...action, accepted: true }
        : { ...action, accepted: false };
    });

    console.log("FINALFILTER: " + JSON.stringify(finalFilter));

    // const finalFilteredCategoriesAndActions = filteredActions.map((action) => {
    //   return filteredCategoriesWithStatus.some(
    //     (categoryAction) => action.id == categoryAction.id
    //   )
    //     ? { ...action, accepted: true }
    //     : { ...action, accepted: false };
    // });

    // console.log("FILTEREDACTION: " + JSON.stringify(filteredActionsWithStatus));

    // console.log(
    //   "FINALFILTERWITHCAT: " + JSON.stringify(finalFilteredCategoriesAndActions)
    // );

    // console.log(
    //   "SAMMANSLAGEN: " +
    //     JSON.stringify([
    //       ...filteredActionsWithStatus,
    //       finalFilteredCategoriesAndActions,
    //     ])
    // );
    setClimateActionsUser(filteredActionsWithStatus);
  };

  return (
    <>
      <div className="w-80 mx-auto  space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2 justify-center">
        <h3 className="heading-lg mb-3">Action of the Month </h3>
        {monthlyAction && (
          <CarouselActionItem
            action={monthlyAction}
            key={monthlyAction.id}
            user={user}
            updateLocalAccepted={updateLocalAccepted}
            addAcceptedAction={addAcceptedAction}
          ></CarouselActionItem>
        )}
      </div>
      <CarouselContainer
        user={user}
        climateActionsUser={climateActionsUser}
        updateLocalAccepted={updateLocalAccepted}
        addAcceptedAction={addAcceptedAction}
        deletedAction={deletedAction}
        climateActionCategories={climateActionCategories}
        category={currCategory}
        setCategory={setCategory}
      />
      <KanbanActionContainer
        setLocalAccepted={setLocalAccepted}
        columns={columns}
        setColumns={setColumns}
        setTotUserActions={setTotUserActions}
        climateActionCategories={climateActionCategories}
        climateActionsUser={climateActionsUser}
        userActions={userActions}
        actionsWithoutUserActions={actionsWithoutUserActions}
        setCategoryBadges={setCategoryBadges}
      />
    </>
  );
};
export default ClimateActionsContainer;

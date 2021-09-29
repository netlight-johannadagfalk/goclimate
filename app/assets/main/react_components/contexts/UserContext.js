import React, { useEffect, useContext, createContext, useReducer } from "react";
import {
  handleAchievementsOnMove,
  getCompleteCategoryArrays,
} from "../helpers/AchievementsHelper";
import {
  formatedUserActions,
  acceptedUserActions,
  columnUserActions,
  findAcceptedUserActions,
} from "../helpers/UserActionsHelper.js";
import { useClimateActionsText } from "../contexts/TextContext.js";

const UserStateContext = createContext(undefined);
const UserActionContext = createContext(undefined);

const initialState = {
  getInitialData: {
    isLoading: true,
    isSuccess: false,
  },
  getInitialUserAction: {
    pendingUserActions: undefined,
    isLoading: false,
    isSuccess: false,
  },
  getInitialColumns: {
    pendingColumns: undefined,
    isLoading: false,
    isSuccess: false,
  },
  getInitialAchievements: {
    pendingAchievements: undefined,
    isLoading: false,
    isSuccess: false,
  },
  getInitialNoOfAcceptedActions: {
    pendingNoAcceptedActions: undefined,
    isLoading: false,
    isSuccess: false,
  },
  data: {
    userActions: undefined,
    columns: undefined,
    achievements: undefined,
    noOfAcceptedActions: undefined,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "update_user_actions_init":
      return {
        ...state,
        getInitialUserAction: {
          pendingUserActions: action.payload,
          isLoading: true,
          isSuccess: false,
        },
      };
    case "update_user_actions_success":
      return {
        ...state,
        data: {
          ...state.data,
          userActions: action.payload,
        },
        getInitialUserAction: {
          pendingUserActions: undefined,
          isLoading: false,
          isSuccess: true,
        },
      };
    case "update_columns_init":
      return {
        ...state,
        getInitialColumns: {
          pendingColumns: action.payload,
          isLoading: true,
          isSuccess: false,
        },
      };
    case "update_columns_success":
      return {
        ...state,
        data: {
          ...state.data,
          columns: action.payload,
        },
        getInitialColumns: {
          pendingColumns: undefined,
          isLoading: false,
          isSuccess: true,
        },
      };

    case "update_achievements_init":
      return {
        ...state,
        getInitialAchievements: {
          pendingAchievements: action.payload,
          isLoading: true,
          isSuccess: false,
        },
      };
    case "update_achievements_success":
      return {
        ...state,
        data: {
          ...state.data,
          achievements: action.payload,
        },
        getInitialAchievements: {
          isLoading: false,
          isSuccess: true,
        },
      };
    case "update_no_of_accepted_actions_success":
      return {
        ...state,
        data: {
          ...state.data,
          noOfAcceptedActions: action.payload,
        },
        getInitialNoOfAcceptedActions: {
          pendingNoOfAcceptedActions: undefined,
          isLoading: false,
          isSuccess: true,
        },
      };
    case "mounting_done":
      return {
        ...state,
        getInitialData: {
          isLoading: false,
          isSuccess: true,
        },
      };
    default:
      throw new Error("Unsupported actions");
  }
};

const UserProvider = ({
  children,
  allUserActions,
  actionsWithoutUserActions,
  actionsWithUserActions,
  climateActionCategories,
  userSubscriptionType,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const climateActionsText = useClimateActionsText();

  const actions = {
    updateUserActions: (actions) => {
      dispatch({ type: "update_user_actions_init", payload: actions });
    },
    updateColumns: (columns) => {
      dispatch({ type: "update_columns_init", payload: columns });
    },
    updateColumnsWithFormat: (updatedList, achievements) => {
      const columns = columnUserActions(
        updatedList,
        achievements,
        climateActionsText
      );
      dispatch({ type: "update_columns_init", payload: columns });
    },
    updateColumnsWithFullFormat: (col, achievements) => {
      const columns = columnUserActions(
        acceptedUserActions(col),
        achievements,
        climateActionsText
      );
      dispatch({ type: "update_columns_init", payload: columns });
    },
    updateAchievements: (achievement) => {
      dispatch({
        type: "update_achievements_init",
        payload: achievement,
      });
    },
    updateAchievementsOnMove: (movedItem, achievementColumn) => {
      return handleAchievementsOnMove(
        movedItem,
        achievementColumn,
        climateActionCategories,
        state.data.userActions,
        actionsWithoutUserActions,
        actionsWithUserActions,
        formatedUserActions
      );
    },
  };

  useEffect(() => {
    dispatch({ type: "update_user_actions_success", payload: allUserActions });

    dispatch({
      type: "update_no_of_accepted_actions_success",
      payload: findAcceptedUserActions(allUserActions),
    });
    const achievements = getCompleteCategoryArrays(
      actionsWithoutUserActions,
      allUserActions,
      climateActionCategories,
      userSubscriptionType
    );

    dispatch({
      type: "update_columns_init",
      payload: columnUserActions(
        acceptedUserActions(allUserActions),
        achievements,
        climateActionsText
      ),
    });
    dispatch({
      type: "update_achievements_init",
      payload: achievements,
    });
  }, [allUserActions]);

  useEffect(() => {
    if (
      state.getInitialUserAction.isSuccess &&
      state.getInitialColumns.isSuccess &&
      state.getInitialAchievements.isSuccess &&
      state.getInitialData.isLoading
    ) {
      dispatch({ type: "mounting_done" });
    }
  }, [state.getInitialAchievements.isSuccess]);

  useEffect(() => {
    const addUserAction = () => {
      if (state.getInitialUserAction.isLoading) {
        dispatch({
          type: "update_user_actions_success",
          payload: state.getInitialUserAction.pendingUserActions,
        });
      }
    };
    addUserAction();
  }, [state.getInitialUserAction.isLoading]);

  useEffect(() => {
    const countUserActions = () => {
      if (state.getInitialUserAction.isSuccess) {
        dispatch({
          type: "update_no_of_accepted_actions_success",
          payload: findAcceptedUserActions(state.data.userActions),
        });
      }
    };
    countUserActions();
  }, [state.getInitialUserAction.isSuccess]);

  useEffect(() => {
    const addColumns = () => {
      if (state.getInitialColumns.isLoading) {
        dispatch({
          type: "update_columns_success",
          payload: state.getInitialColumns.pendingColumns,
        });
      }
    };
    addColumns();
  }, [state.getInitialColumns.isLoading]);

  useEffect(() => {
    const addAchievements = () => {
      if (state.getInitialAchievements.isLoading) {
        dispatch({
          type: "update_achievements_success",
          payload: state.getInitialAchievements.pendingAchievements,
        });
      }
    };

    addAchievements();
  }, [state.getInitialAchievements.isLoading]);

  return (
    <>
      <UserStateContext.Provider value={state}>
        <UserActionContext.Provider value={actions}>
          {children}
        </UserActionContext.Provider>
      </UserStateContext.Provider>
    </>
  );
};

const useUserState = () => {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error(
      "Please wrap component in UserProvider to use useUserState"
    );
  }

  return context;
};

const useUserActions = () => {
  const context = useContext(UserActionContext);

  if (!context) {
    throw new Error(
      "Please wrap component in UserProvider to use useUserActions"
    );
  }

  return context;
};

export { UserProvider, useUserState, useUserActions };

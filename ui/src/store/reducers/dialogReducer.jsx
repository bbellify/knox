import { actionTypes } from "../actions/dialogActions";

export const dialogReducer = (state, action) => {
  if (!action || !action.type) return state;

  switch (action.type) {
    case actionTypes.OPEN_SETTINGS: {
      return {
        ...state,
        settingsOpen: true,
        vaultOpen: false,
      };
    }
    case actionTypes.CLOSE_SETTINGS: {
      return {
        ...state,
        settingsOpen: false,
      };
    }
    case actionTypes.OPEN_INFO: {
      return {
        ...state,
        infoOpen: true,
      };
    }
    case actionTypes.CLOSE_INFO: {
      return {
        ...state,
        infoOpen: false,
      };
    }
    case actionTypes.OPEN_DELETE: {
      return {
        ...state,
        deleteOpen: true,
        deleteId: action.id,
      };
    }
    case actionTypes.CLOSE_DELETE: {
      return {
        ...state,
        deleteOpen: false,
        deleteId: "",
      };
    }
    case actionTypes.OPEN_ADD: {
      return {
        ...state,
        addOpen: true,
      };
    }
    case actionTypes.CLOSE_ADD: {
      return {
        ...state,
        addOpen: false,
        generated: "",
      };
    }
    case actionTypes.OPEN_EDIT: {
      return {
        ...state,
        generated: "",
        editEntry: action.entry,
        editOpen: true,
      };
    }
    case actionTypes.CLOSE_EDIT: {
      return {
        ...state,
        editOpen: false,
        editEntry: {},
        generated: "",
      };
    }
    case actionTypes.SET_GENERATED: {
      return {
        ...state,
        generated: action.pass,
      };
    }
    case actionTypes.OPEN_VAULT: {
      return {
        ...state,
        vaultOpen: true,
        settingsOpen: false,
      };
    }
    case actionTypes.CLOSE_VAULT: {
      return {
        ...state,
        vaultOpen: false,
      };
    }
  }
};

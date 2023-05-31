import { actionTypes } from "../actions/settingsActions";

export const settingsReducer = (state, action) => {
  if (!action || !action.type) return state;

  switch (action.type) {
    case actionTypes.SET_SETTINGS: {
      let setsObj = {};
      action.settings.forEach((set) => {
        let val = Object.values(set)[0];
        switch (val) {
          case "true":
            val = true;
            break;
          case "false":
            val = false;
            break;
          default:
            return val;
        }
        setsObj = {
          ...setsObj,
          [Object.keys(set)[0]]: val,
        };
      });

      return setsObj;
    }
  }
};

export const actionTypes = {
  SET_SETTINGS: "SET_SETTINGS",
};

export const actions = {
  setSettings: (settings) => ({
    type: actionTypes.SET_SETTINGS,
    settings: settings,
  }),
};

export default actions;

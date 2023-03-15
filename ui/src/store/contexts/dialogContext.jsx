import React, { createContext, useReducer } from "react";
import { dialogReducer } from "../reducers/dialogReducer";

export const DialogContext = createContext({});
const { Provider } = DialogContext;

export const defaultState = {
  vaultOpen: true,
  settingsOpen: false,
  infoOpen: false,
  deleteOpen: false,
  deleteId: "",
  addOpen: false,
  editOpen: true,
  editEntry: {},
  generated: "",
};

export const DialogProvider = ({ children }) => {
  const [state, reducer] = useReducer(dialogReducer, defaultState);

  return <Provider value={[state, reducer]}>{children}</Provider>;
};

export default DialogContext;

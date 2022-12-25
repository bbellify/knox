import React, { createContext, useReducer } from "react";
import { dialogReducer } from "../reducers/dialogReducer";

export const DialogContext = createContext({});
const { Provider } = DialogContext;

export const defaultState = {
  infoOpen: false,
  deleteOpen: false,
  deleteId: "",
  addOpen: false,
  editOpen: false,
  editWebsite: "",
  editUsername: "",
  editPassword: "",
  editId: "",
  settingsOpen: false,
  generated: "",
};

export const DialogProvider = ({ children }) => {
  const [state, reducer] = useReducer(dialogReducer, defaultState);

  return <Provider value={[state, reducer]}>{children}</Provider>;
};

export default DialogContext;

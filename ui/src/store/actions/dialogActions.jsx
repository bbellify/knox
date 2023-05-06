export const actionTypes = {
  OPEN_INFO: "OPEN_INFO",
  CLOSE_INFO: "CLOSE_INFO",
  OPEN_DELETE: "OPEN_DELETE",
  CLOSE_DELETE: "CLOSE_DELETE",
  DELETE: "DELETE",
  OPEN_ADD: "OPEN_ADD",
  CLOSE_ADD: "CLOSE_ADD",
  OPEN_EDIT: "OPEN_EDIT",
  CLOSE_EDIT: "CLOSE_EDIT",
  SET_GENERATED: "SET_GENERATED",
  OPEN_SETTINGS: "OPEN_SETTINGS",
  CLOSE_SETTINGS: "CLOSE_SETTINGS",
  OPEN_VAULT: "OPEN_VAULT",
  CLOSE_VAULT: "CLOSE_VAULT",
};

export const actions = {
  openInfoModal: () => ({
    type: actionTypes.OPEN_INFO,
  }),

  closeInfoModal: () => ({
    type: actionTypes.CLOSE_INFO,
  }),

  openDeleteModal: (id) => ({
    type: actionTypes.OPEN_DELETE,
    id: id,
  }),

  closeDeleteModal: () => ({
    type: actionTypes.CLOSE_DELETE,
  }),

  delete: () => ({
    type: actionTypes.DELETE,
  }),

  openAdd: () => ({
    type: actionTypes.OPEN_ADD,
  }),

  closeAdd: () => ({
    type: actionTypes.CLOSE_ADD,
  }),

  openEditing: (entry) => ({
    type: actionTypes.OPEN_EDIT,
    entry: entry,
  }),

  closeEditing: () => ({
    type: actionTypes.CLOSE_EDIT,
  }),

  setGenerated: (pass) => ({
    type: actionTypes.SET_GENERATED,
    pass: pass,
  }),

  openSettings: () => ({
    type: actionTypes.OPEN_SETTINGS,
  }),

  closeSettings: () => ({
    type: actionTypes.CLOSE_SETTINGS,
  }),

  openVault: () => ({
    type: actionTypes.OPEN_VAULT,
  }),

  closeVault: () => ({
    type: actionTypes.CLOSE_VAULT,
  }),
};

export default actions;

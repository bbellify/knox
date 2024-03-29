import { actionTypes } from "../actions/vaultActions";
import { aesDecrypt, getSecret } from "../../utils";

export const vaultReducer = (state, action) => {
  if (!action || !action.type) return state;

  switch (action.type) {
    case actionTypes.SET_VAULT: {
      const vault = action.vault;
      let newVault = [];
      vault.forEach((entry) => {
        newVault.push({
          id: entry.id,
          website: aesDecrypt(entry.website, getSecret()),
          username: aesDecrypt(entry.username, getSecret()),
          password: aesDecrypt(entry.password, getSecret()),
          updated: new Date(entry.updated),
        });
      });
      return newVault.sort((a, b) => (a.website > b.website ? 1 : -1));
    }
  }
};

import React, { useContext, useState, useEffect } from "react";

import { UrbitContext } from "../../store/contexts/urbitContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import { SettingsContext } from "../../store/contexts/settingsContext";
import dialogActions from "../../store/actions/dialogActions";
import settingsActions from "../../store/actions/settingsActions";
import { getSecret } from "../../utils";

import { InfoDialog } from "../dialogs/infoDialog";
import { Settings } from "../dialogs/settings";
import { AddDialog } from "../dialogs/addDialog";
import { DeleteDialog } from "../dialogs/deleteDialog";
import { EditDialog } from "../dialogs/editDialog";
import { Vault } from "../vault/vault";

export const Home = () => {
  const [urbitApi] = useContext(UrbitContext);
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const [, settingsDispatch] = useContext(SettingsContext);
  const { openInfoDialog, openVault, closeVault, openSettings, closeSettings } =
    dialogActions;
  const { setSettings } = settingsActions;

  useEffect(() => {
    if (!getSecret()) navigate("/apps/knox/login");
  }, []);

  // get settings and set to context
  useEffect(() => {
    urbitApi
      .scry({
        app: "knox",
        path: "/settings",
      })
      .then((res) => {
        settingsDispatch(setSettings(res.settings));
      })
      // TODO: handle this error?
      .catch((err) => console.log("err", err));
  }, []);

  return (
    <div className="flex h-screen95">
      {dialogState.infoOpen && <InfoDialog />}
      {/* {dialogState.addOpen && <AddDialog />} */}
      {/* {dialogState.editOpen && <EditDialog />} */}
      {/* {dialogState.deleteOpen && <DeleteDialog />} */}
      {/* {dialogState.settingsOpen && <Settings />} */}

      <div className="flex flex-col bg-timberwolf w-1/5 md:min-w-[300px]">
        <div className="flex h-12 items-center px-1">
          <p className="text-xl text-font align-middle flex font-semibold">
            knox
            <span className="hidden md:inline ml-1">- your password vault</span>
            <button
              className="px-2 flex items-center hover:scale-125"
              onClick={() => dialogDispatch(openInfoDialog())}
            >
              <ion-icon name="information-circle-outline" />
            </button>
          </p>
        </div>
        <div className="flex flex-col py-1 border-t border-black ">
          <button
            className="text-left p-1 hover:bg-whiteSmoke"
            onClick={() =>
              dialogDispatch(dialogState.vaultOpen ? closeVault() : openVault())
            }
          >
            Website Accounts
          </button>
          <button
            className="text-left p-1 hover:bg-whiteSmoke"
            onClick={() =>
              dialogDispatch(
                dialogState.settingsOpen ? closeSettings() : openSettings()
              )
            }
          >
            Settings
          </button>
        </div>
      </div>
      {/* </div> */}
      <div className="w-4/5 min-w-[600px] flex flex-col h-full">
        {dialogState.vaultOpen && <Vault />}
        {dialogState.settingsOpen && <Settings />}
      </div>
    </div>
  );
};

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UrbitContext } from "../../store/contexts/urbitContext";
import { VaultContext } from "../../store/contexts/vaultContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import { SettingsContext } from "../../store/contexts/settingsContext";
import vaultActions from "../../store/actions/vaultActions";
import dialogActions from "../../store/actions/dialogActions";
import settingsActions from "../../store/actions/settingsActions";
import { getSecret } from "../../utils";

import { VaultTableBody } from "./vaultTableBody";
import { InfoDialog } from "../dialogs/infoDialog";
import { Settings } from "../dialogs/settings";
import { AddDialog } from "../dialogs/addDialog";
import { DeleteDialog } from "../dialogs/deleteDialog";
import { EditDialog } from "../dialogs/editDialog";
import { Actions } from "./actions";

export const Vault = () => {
  const [searchValue, setSearchValue] = useState("");

  const [urbitApi] = useContext(UrbitContext);
  const [vaultState, vaultDispatch] = useContext(VaultContext);
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const [, settingsDispatch] = useContext(SettingsContext);
  const { setVault } = vaultActions;
  const { openInfoDialog } = dialogActions;
  const { setSettings } = settingsActions;

  const navigate = useNavigate();

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

  // get vault and set to context
  useEffect(() => {
    urbitApi
      .scry({
        app: "knox",
        path: "/vault",
      })
      .then((res) => vaultDispatch(setVault(res.vault)))
      // TODO: use this to set an error?
      .catch((err) => console.log("err", err));
  }, []);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  return (
    <div className="flex h-full w-full">
      {/* top buttons for generating, adding, opening settings */}
      <div className="w-1/2 bg-timberwolf h-full mx-1">
        {/* title and search */}
        <div className="flex pt-1 pb-3 pl-2 pr-1 justify-end">
          {/* do I need Actions here? */}
          {/* <Actions /> */}
          <div className="flex">
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-font"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              {/* search input */}
              <input
                type="text"
                className="p-2 pl-10 w-32 text-sm rounded-lg bg-blueMain placeholder-font text-font focus:outline-none focus:ring focus:ring-gray-500"
                placeholder="search"
                onChange={handleSearch}
                value={searchValue}
              />
            </div>
          </div>
        </div>
        {/* beginning of table */}
        <div
          className={`overflow-x-auto h-full 2xl:h-screen60 sm:p-0 ${
            !vaultState.length ? "border-t" : ""
          }`}
        >
          <table
            className={`w-full text-gray-400 table-fixed w-full ${
              !vaultState.length ? "h-full" : ""
            }`}
          >
            {!vaultState.length ? (
              <thead className="w-full h-full text-center sm:text-2xl md:text-3xl text-xl align-middle">
                <tr>
                  <td className="px-2 pt-20 sm:pt-0">
                    Get started by clicking the{" "}
                    <span className="inline-flex align-bottom pb-1">
                      <ion-icon name="add" />
                    </span>{" "}
                    button above <br />
                    <br />
                    Click on the{" "}
                    <span className="inline-flex align-bottom pb-1">
                      <ion-icon name="dice-outline" />
                    </span>{" "}
                    button above to generate a password
                  </td>
                </tr>
              </thead>
            ) : (
              <>
                <colgroup>
                  <col className="w-[25%]" />
                  <col className="w-[30%]" />
                  <col className="w-[20%]" />
                  <col className="w-[8%]" />
                  <col className="w-[12%]" />
                </colgroup>
                <thead className="sticky top-0 z-10">
                  <tr className="text-left bg-blueMain text-center shadow">
                    <th className="text-font font-medium">site</th>
                    <th className="text-font font-medium">username</th>
                    <th className="text-font font-medium">password</th>
                    <th className="text-font font-medium">view</th>
                    <th className="text-font font-medium">edit</th>
                  </tr>
                </thead>
                <VaultTableBody searchValue={searchValue} vault={vaultState} />
              </>
            )}
          </table>
        </div>
      </div>
      <div className="w-1/2">
        {dialogState.addOpen && <AddDialog />}
        {dialogState.editOpen && <EditDialog />}
        {dialogState.deleteOpen && <DeleteDialog />}
      </div>
    </div>
  );
};
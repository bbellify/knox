import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UrbitContext } from "../../store/contexts/urbitContext";
import { VaultContext } from "../../store/contexts/vaultContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import { SettingsContext } from "../../store/contexts/settingsContext";
import vaultActions from "../../store/actions/vaultActions";
import settingsActions from "../../store/actions/settingsActions";
import { getSecret } from "../../utils";

import { VaultTableBody } from "./vaultTableBody";
import { AddEntry } from "../dialogs/addEntry";
import { DeleteDialog } from "../dialogs/deleteDialog";
import { Actions } from "./actions";

export const Vault = () => {
  const [searchValue, setSearchValue] = useState("");

  const [urbitApi] = useContext(UrbitContext);
  const [vaultState, vaultDispatch] = useContext(VaultContext);
  const [dialogState] = useContext(DialogContext);
  const [settingsState, settingsDispatch] = useContext(SettingsContext);
  const { setVault } = vaultActions;
  const { setSettings } = settingsActions;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!getSecret()) navigate("/apps/knox/login");
  }, []);

  // get settings and set to context
  useEffect(() => {
    if (!Object.entries(settingsState)) {
      urbitApi
        .scry({
          app: "knox",
          path: "/settings",
        })
        .then((res) => {
          settingsDispatch(setSettings(res.settings));
        })
        // TODO: handle error
        .catch((err) => console.log("error", err));
    }
  }, []);

  // get vault and set to context
  useEffect(() => {
    if (!vaultState.length) {
      setLoading(true);
      urbitApi
        .scry({
          app: "knox",
          path: "/vault",
        })
        .then((res) => {
          vaultDispatch(setVault(res.vault));
          setLoading(false);
        })
        // TODO: handle error
        .catch((err) => console.log("error", err));
    }
  }, []);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  return (
    <div className="flex h-full w-full">
      {/* top buttons for generating, adding, opening settings */}
      <div className="w-[90%] md:max-w-[90%] bg-timberwolf h-full mx-1">
        {/* actions and search */}
        <div className="flex justify-between h-12">
          <Actions />
          <div className="flex p-1">
            <div className="flex items-center w-auto sm:w-44 rounded-lg pl-3 border-blackMain border bg-whiteSmoke">
              <ion-icon name="search-sharp" id="mag-glass" />
              {/* search input */}
              <input
                type="text"
                className="pl-3 w-full text-sm rounded-lg placeholder-font font-blackMain focus:outline-none focus:none bg-whiteSmoke"
                placeholder="Search"
                onChange={handleSearch}
                value={searchValue}
              />
            </div>
          </div>
        </div>
        {/* beginning of table */}
        <div
          className={`overflow-x-auto h-full 2xl:h-screen60 sm:p-0 ${
            !vaultState.length && "border-t"
          }`}
        >
          {!vaultState.length && !loading ? (
            dialogState.addOpen ? (
              <table className="w-full text-gray-400 table-fixed w-full">
                {tableColumnHeaders()}
                <tbody>
                  <AddEntry />
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center sm:text-2xl md:text-3xl text-xl h-1/2 pt-12 px-2">
                <p className="text-center">
                  Get started by clicking the{" "}
                  <span className="inline-flex align-bottom pb-1">
                    <ion-icon name="add" />
                  </span>{" "}
                  button above. <br />
                  <br />
                  Click on the{" "}
                  <span className="inline-flex align-bottom pb-1">
                    <ion-icon name="dice-outline" />
                  </span>{" "}
                  button above to generate a password.
                </p>
              </div>
            )
          ) : (
            <table
              className={`w-full text-gray-400 table-fixed w-full ${
                !vaultState.length ? "h-full" : ""
              }`}
            >
              {tableColumnHeaders()}
              <VaultTableBody searchValue={searchValue} vault={vaultState} />
            </table>
          )}
        </div>
        {dialogState.deleteOpen && <DeleteDialog />}
      </div>
    </div>
  );
};

const tableColumnHeaders = () => {
  return (
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
          <th className="text-font font-medium">Site</th>
          <th className="text-font font-medium">Username</th>
          <th className="text-font font-medium">Password</th>
          <th className="text-font font-medium">View</th>
          <th className="text-font font-medium">Edit</th>
        </tr>
      </thead>
    </>
  );
};

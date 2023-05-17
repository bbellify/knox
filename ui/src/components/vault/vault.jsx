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
        // TODO: handle this error?
        .catch((err) => console.log("err", err));
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
        // TODO: use this to set an error?
        .catch((err) => console.log("err", err));
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
        <div className="flex justify-between h-12 pr-1">
          <Actions />
          <div className="flex items-center">
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-2 pointer-events-none">
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
                className="py-2 pl-8 pr-2 w-24 text-sm rounded-lg bg-blueMain placeholder-font text-font focus:outline-none focus:ring focus:ring-gray-500"
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
                  button above <br />
                  <br />
                  Click on the{" "}
                  <span className="inline-flex align-bottom pb-1">
                    <ion-icon name="dice-outline" />
                  </span>{" "}
                  button above to generate a password
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
          <th className="text-font font-medium">site</th>
          <th className="text-font font-medium">username</th>
          <th className="text-font font-medium">password</th>
          <th className="text-font font-medium">view</th>
          <th className="text-font font-medium">edit</th>
        </tr>
      </thead>
    </>
  );
};

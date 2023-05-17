import React, { useContext, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { saveAs } from "file-saver";

import { UrbitContext } from "../store/contexts/urbitContext";
import { SettingsContext } from "../store/contexts/settingsContext";
import { VaultContext } from "../store/contexts/vaultContext";
import { DialogContext } from "../store/contexts/dialogContext";
import settingsActions from "../store/actions/settingsActions";
import dialogActions from "../store/actions/dialogActions";

import {
  aesDecrypt,
  getSecret,
  prepareExport,
  prepareImport,
  dummyD,
} from "../utils";

export const Settings = () => {
  const [urbitApi] = useContext(UrbitContext);
  const [settingsState, settingsDispatch] = useContext(SettingsContext);
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const [vaultState] = useContext(VaultContext);
  const [setsForm, setSetsForm] = useState(settingsState);
  const [error, setError] = useState(false);
  const [importState, setImportState] = useState(null);
  const [showInfo, setShowInfo] = useState({ export: false, import: false });
  const { setSettings } = settingsActions;
  const { closeSettings } = dialogActions;

  useEffect(() => {
    setSetsForm(settingsState);
  }, [settingsState]);

  const handleScry = () => {
    urbitApi
      .scry({
        app: "knox",
        path: "/settings",
      })
      .then((res) => {
        settingsDispatch(setSettings(res.settings));
      })
      .catch(() => handleError());
  };

  const handleChange = (setting) => {
    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          sett: {
            "setting-key": setting,
            "setting-val": `${!setsForm[setting]}`,
          },
        },
      })
      .then(() => handleScry())
      .catch(() => setError(true));
  };

  const handleReset = () => {
    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          "reset-set": {
            num: parseInt(1),
          },
        },
      })
      .then(() => handleScry())
      .catch(() => handleError());
  };

  const handleExport = () => {
    const blob = new Blob([prepareExport(vaultState)]);
    saveAs(blob, "vault.knox");
  };

  const handleImport = (e) => {
    console.log("handle import");
    // decode the uploaded string and send to knox

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const contents = e.target.result;
      if (aesDecrypt(contents, getSecret())) {
        setImportState(aesDecrypt(contents, getSecret()));
        console.log("importState", aesDecrypt(contents, getSecret()));
      }
    };
    reader.readAsText(file);
  };

  const handleSubmitImport = () => {
    console.log("import state", importState);
  };

  const importPoke = () => {
    // prepareImport(dummyD);
    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          import: prepareImport(dummyD),
        },
      })
      .then(() => handleScry())
      .catch(() => handleError());
  };

  return (
    <div className="bg-timberwolf mx-1 h-full w-1/2">
      <div className="mb-12">
        <div className="flex h-12 bg-blueMain items-center px-1">
          <p className="text-xl">Settings</p>
        </div>
        <div className="px-3">
          <div className="flex my-4 justify-between">
            <p>Show welcome screen</p>
            <Switch
              checked={setsForm.showWelcome}
              onChange={() => handleChange("showWelcome")}
              className={`${
                setsForm.showWelcome ? "bg-blueMain" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full mx-2 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-300`}
            >
              <span
                className={`${
                  setsForm.showWelcome ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          <div className="flex mt-4 justify-between">
            <p>Click to copy hidden passwords</p>

            <Switch
              checked={setsForm.copyHidden}
              onChange={() => handleChange("copyHidden")}
              className={`${
                setsForm.copyHidden ? "bg-blueMain" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full mx-2 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-300`}
            >
              <span
                className={`${
                  setsForm.copyHidden ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          <div className="flex mt-4 justify-between">
            <p>One-click delete (skip delete warning)</p>
            <Switch
              checked={setsForm.skipDeleteWarn}
              onChange={() => {
                handleChange("skipDeleteWarn");
              }}
              className={`${
                setsForm.skipDeleteWarn ? "bg-blueMain" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full mx-2 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-300`}
            >
              <span
                className={`${
                  setsForm.skipDeleteWarn ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          <div className="flex mt-4 justify-between">
            <button
              onClick={handleReset}
              className="w-full text-left hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-500"
            >
              Restore Default Settings
            </button>
          </div>
        </div>
      </div>

      {error && (
        <button
          disabled
          className="my-1 w-[75%] border border-black p-1 rounded bg-red-400 pointer-events-none"
        >
          Something went wrong. Try again.
        </button>
      )}

      <div>
        <div className="flex h-12 bg-blueMain items-center px-1">
          <p className="text-xl">Tools</p>
        </div>
        {/* TODO add some ? icon or similar for showing info on each of these tools - state object exists above for this purpose */}
        <button
          onClick={handleExport}
          className="w-full text-left p-1 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-500"
        >
          Export Vault
        </button>

        <input type="file" onChange={handleImport} />
        <button
          // onClick={handleSubmitImport}
          onClick={() => importPoke()}
          className="w-full text-left p-1 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-500"
        >
          Import Vault
        </button>

        <button
          // onClick={handleReset}
          className="w-full text-left p-1 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-500"
        >
          Cycle passwords
        </button>
      </div>
    </div>
  );
};

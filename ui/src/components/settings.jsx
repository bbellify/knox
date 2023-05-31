import React, { useContext, useEffect, useState } from "react";
import { Switch, Disclosure } from "@headlessui/react";
import { saveAs } from "file-saver";

import { UrbitContext } from "../store/contexts/urbitContext";
import { SettingsContext } from "../store/contexts/settingsContext";
import { VaultContext } from "../store/contexts/vaultContext";
import { DialogContext } from "../store/contexts/dialogContext";
import settingsActions from "../store/actions/settingsActions";
import vaultActions from "../store/actions/vaultActions";
import dialogActions from "../store/actions/dialogActions";

import { aesDecrypt, getSecret, prepareExport, prepareImport } from "../utils";

export const Settings = () => {
  const [urbitApi] = useContext(UrbitContext);
  const [settingsState, settingsDispatch] = useContext(SettingsContext);
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const [vaultState, vaultDispatch] = useContext(VaultContext);
  const [setsForm, setSetsForm] = useState(settingsState);
  const [error, setError] = useState(false);
  const [importState, setImportState] = useState(null);
  const [showInfo, setShowInfo] = useState({ export: false, import: false });
  const { setSettings } = settingsActions;
  const { setVault } = vaultActions;
  const { closeSettings } = dialogActions;

  useEffect(() => {
    setSetsForm(settingsState);
  }, [settingsState]);

  const handleScry = (path) => {
    urbitApi
      .scry({
        app: "knox",
        path: path,
      })
      .then((res) => {
        switch (path) {
          case "/vault":
            vaultDispatch(setVault(res.vault));
            break;
          case "/settings":
            settingsDispatch(setSettings(res.settings));
            break;
          default:
            return;
        }
      })
      // .catch(() => handleError());
      .catch((err) => console.log("err", err));
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
      .then(() => handleScry("/settings"))
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
      .then(() => handleScry("/settings"))
      .catch(() => handleError());
  };

  const handleExport = () => {
    const blob = new Blob([prepareExport(vaultState)]);
    saveAs(blob, "vault.knox");
  };

  // decode the uploaded string and send to knox
  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const contents = e.target.result;
      if (aesDecrypt(contents, getSecret())) {
        setImportState(aesDecrypt(contents, getSecret()));
      }
    };
    reader.readAsText(file);
  };

  const handleSubmitImport = () => {
    importPoke();
  };

  const importPoke = () => {
    // TODO set error/message something here if !importState
    if (!importState) return;
    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          import: prepareImport(importState),
        },
      })
      .then(() => handleScry("/vault"))
      .catch(() => handleError());
  };

  return (
    <div className="bg-timberwolf mx-1 h-full w-1/2">
      {/* settings */}
      <div className="mb-12">
        <div className="flex h-12 bg-blueMain items-center px-1 shadow">
          <p className="text-xl">Settings</p>
          <ion-icon name="options-outline" id="settings-icon" />
        </div>
        <div className="px-3">
          <div className="flex my-4 justify-between">
            <p>Show welcome screen</p>
            <Switch
              checked={setsForm.showWelcome}
              onChange={() => handleChange("showWelcome")}
              className={`${
                setsForm.showWelcome ? "bg-blueMain" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full mx-2 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400`}
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
              } relative inline-flex h-6 w-11 items-center rounded-full mx-2 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400`}
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
              } relative inline-flex h-6 w-11 items-center rounded-full mx-2 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400`}
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
              className="w-full p-2 px-3 text-left hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400"
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

      {/* tools */}
      <div>
        <div className="flex h-12 bg-blueMain items-center px-1 shadow">
          <p className="text-xl">Tools</p>
          <ion-icon name="build-outline" id="tools-icon" />
        </div>
        <div className="px-3 py-3">
          {/* TODO add some ? icon or similar for showing info on each of these tools - state object exists above for this purpose */}

          {/* cycle passwords and change secret hidden for now */}
          <div className="hidden">
            <Disclosure>
              <Disclosure.Button className="w-full text-left p-2 px-3 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400">
                Change secret
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="flex flex-col py-2">
                  <input
                    placeholder="old secret"
                    className="my-1 w-2/3 p-2 px-3"
                  />
                  <input
                    placeholder="new secret"
                    className="my-1 w-2/3 p-2 px-3"
                  />
                  <div className="flex">
                    <input
                      placeholder="confirm new secret"
                      className="my-1 w-2/3 p-2 px-3"
                    />
                    <div className="w-1/3 p-2 flex justify-center">
                      <button className="w-full p-2 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400">
                        save
                      </button>
                    </div>
                  </div>
                </div>
              </Disclosure.Panel>
            </Disclosure>
            <div className="flex my-4 justify-between">
              <button className="w-full text-left p-2 px-3 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400">
                Cycle passwords
              </button>
            </div>
          </div>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full text-left p-2 px-3 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400">
                  <div className="flex justify-between">
                    <p>Export vault</p>
                    {open ? (
                      <ion-icon name="remove-outline"></ion-icon>
                    ) : (
                      <ion-icon name="add-outline" />
                    )}
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel>
                  <div className="flex my-4 justify-between">
                    <p>
                      This will save an excrypted file called vault.knox that
                      you can use to restore Knox to a certain state. Encrypts
                      with current secret.
                    </p>
                    <button
                      onClick={handleExport}
                      className="w-full text-left p-2 px-3 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400"
                    >
                      Export vault
                    </button>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="my-4 w-full text-left p-2 px-3 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400">
                  <div className="flex justify-between">
                    <p>Import vault</p>
                    {open ? (
                      <ion-icon name="remove-outline"></ion-icon>
                    ) : (
                      <ion-icon name="add-outline" />
                    )}
                  </div>
                </Disclosure.Button>

                <Disclosure.Panel>
                  <div className="flex justify-between">
                    <p>
                      Here you can import a vault.knox file you created. Note
                      here about how secret should work.. this about this also
                    </p>
                  </div>
                  <div className="flex flex-col my-4 justify-between">
                    <button
                      disabled={importState ? false : true}
                      onClick={() => importPoke()}
                      className="text-left p-2 px-3 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-500 disabled:text-gray-400 disabled:hover:bg-transparent disabled:pointer-events-none border border-gray-400"
                    >
                      Import vault
                    </button>
                    <input
                      type="file"
                      onChange={handleImport}
                      className="mt-3"
                    />
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
};

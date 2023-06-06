import React, { useContext, useEffect, useState } from "react";
import { Switch, Disclosure } from "@headlessui/react";
import { saveAs } from "file-saver";

import { UrbitContext } from "../store/contexts/urbitContext";
import { SettingsContext } from "../store/contexts/settingsContext";
import { VaultContext } from "../store/contexts/vaultContext";
import settingsActions from "../store/actions/settingsActions";
import vaultActions from "../store/actions/vaultActions";

import { aesDecrypt, getSecret, prepareExport, prepareImport } from "../utils";

export const Settings = () => {
  const [urbitApi] = useContext(UrbitContext);
  const [settingsState, settingsDispatch] = useContext(SettingsContext);
  const [vaultState, vaultDispatch] = useContext(VaultContext);
  const [setsForm, setSetsForm] = useState(settingsState);
  const [setsStatus, setSetsStatus] = useState(null);
  const [importState, setImportState] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const { setSettings } = settingsActions;
  const { setVault } = vaultActions;

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
      // TODO: handle error
      .catch((err) => console.log("error", err));
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
      .then(() => {
        setSetsStatus(null);
        handleScry("/settings");
      })
      .catch(() => setSetsStatus("error"));
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
      .then(() => {
        setSetsStatus("success");
        handleScry("/settings");
      })
      .catch(() => setSetsStatus("error"));
  };

  const handleExport = () => {
    const blob = new Blob([prepareExport(vaultState)]);
    saveAs(blob, "vault.knox");
  };

  // decode the uploaded string and send to knox
  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      if (aesDecrypt(contents, getSecret())) {
        setImportState(aesDecrypt(contents, getSecret()));
      }
    };
    reader.readAsText(file);
  };

  const importPoke = () => {
    // TODO: set error/message something here if !importState
    if (!importState) return;
    setImportStatus("loading");

    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          import: prepareImport(importState),
        },
      })
      .then(() => {
        setImportStatus("success");
        handleScry("/vault");
      })
      // TODO: handle error
      .catch(() => setImportStatus("error"));
  };

  return (
    <div className="bg-timberwolf mx-1 h-full w-1/2">
      {/* settings */}
      <div
        className={setsStatus === "error" ? "border-2 border-error" : "mb-6"}
      >
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
              <div className="flex justify-between items-center">
                <p className="inline">Restore Default Settings</p>
                {setsStatus === "success" && (
                  <ion-icon name="checkmark-sharp" />
                )}
              </div>
            </button>
          </div>
        </div>
        {setsStatus === "error" && (
          <div className="mt-4 mb-6 flex justify-center">
            <p className="text-font">Something went wrong. Try again.</p>
            <button
              onClick={() => setSetsStatus(null)}
              className="flex text-font items-center ml-2 focus:outline-none focus:ring focus:ring-gray-500 rounded"
            >
              <ion-icon name="close" class="icons" />
            </button>
          </div>
        )}
      </div>

      {/* tools */}
      <div>
        <div className="flex h-12 bg-blueMain items-center px-1 shadow">
          <p className="text-xl">Tools</p>
          <ion-icon name="build-outline" id="tools-icon" />
        </div>
        <div className="px-3 py-3">
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
                  <div className="flex justify-between items-center">
                    <p>Export vault</p>
                    {open ? (
                      <ion-icon name="remove-outline" />
                    ) : (
                      <ion-icon name="add-outline" />
                    )}
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel>
                  <div className="flex my-4 justify-between">
                    <p>
                      This will save a backup of your vault, excrypted with your
                      current secret, in a file called vault.knox.
                    </p>
                    <button
                      onClick={handleExport}
                      className="w-full text-center p-2 px-3 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-500 border border-gray-400"
                    >
                      Export
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
                  <div className="flex justify-between items-center">
                    <p>Import vault</p>
                    {open ? (
                      <ion-icon name="remove-outline" />
                    ) : (
                      <ion-icon name="add-outline" />
                    )}
                  </div>
                </Disclosure.Button>

                <Disclosure.Panel>
                  <div className="flex justify-between">
                    <p>
                      Load a backup of your vault created with export tool.
                      Currently will only work if secret used to encrypt
                      originally is still your current secret. Importing will{" "}
                      <strong>replace</strong> your current vault.
                    </p>
                  </div>
                  <div className="flex flex-col my-4 justify-between">
                    <input
                      type="file"
                      id="import-input"
                      className="focus:outline-none focus:ring focus:ring-gray-500 rounded"
                      onChange={handleImport}
                    />
                    <button
                      disabled={importState ? false : true}
                      onClick={() => importPoke()}
                      className="mt-3 text-left p-2 px-3 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-500 disabled:text-gray-400 disabled:hover:bg-transparent disabled:pointer-events-none border border-gray-400"
                    >
                      <div className="flex justify-between items-center">
                        <p className="inline">Import</p>
                        {importStatus === "loading" && (
                          <p className="animate-spin">~</p>
                        )}
                        {importStatus === "success" && (
                          <ion-icon name="checkmark-sharp" />
                        )}
                      </div>
                    </button>
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

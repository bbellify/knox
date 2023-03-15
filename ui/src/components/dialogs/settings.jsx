import React, { useContext, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";

import { UrbitContext } from "../../store/contexts/urbitContext";
import { SettingsContext } from "../../store/contexts/settingsContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import settingsActions from "../../store/actions/settingsActions";
import dialogActions from "../../store/actions/dialogActions";

export const Settings = () => {
  const [urbitApi] = useContext(UrbitContext);
  const [settingsState, settingsDispatch] = useContext(SettingsContext);
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const [setsForm, setSetsForm] = useState(settingsState);
  const [loading, setLoading] = useState({});
  const [allLoading, setAllLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setSettings } = settingsActions;
  const { closeSettings } = dialogActions;

  useEffect(() => {
    setSetsForm(settingsState);
  }, [settingsState]);

  const handleScry = (setting) => {
    urbitApi
      .scry({
        app: "knox",
        path: "/settings",
      })
      .then((res) => {
        // TODO: need a better way to handle loading for all (for reset), here and in handleReset
        setting
          ? setLoading({ ...loading, [setting]: false })
          : setAllLoading(false);
        settingsDispatch(setSettings(res.settings));
      })
      .catch(() => handleError());
  };

  const handleChange = (setting) => {
    setLoading({
      ...loading,
      [setting]: true,
    });

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
      .then(() => handleScry(setting))
      .catch(() => handleError(setting));
  };

  const handleError = (setting) => {
    setting
      ? setLoading({
          ...loading,
          [setting]: false,
        })
      : setAllLoading(false);
    setError(true);
  };

  const handleReset = () => {
    setAllLoading(true);
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

  return (
    <div className="bg-timberwolf mx-1 h-full w-1/2">
      <div className="">
        <p className="text-xl">Settings</p>
        <div className="flex my-4 justify-between">
          <p>Show welcome screen</p>
          {loading.showWelcome || allLoading ? (
            <div className="animate-spin mr-6">~</div>
          ) : (
            <Switch
              checked={setsForm.showWelcome}
              onChange={() => handleChange("showWelcome")}
              className={`${
                setsForm.showWelcome ? "bg-blueMain" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full mx-2 focus:outline-none focus:ring focus:ring-gray-500`}
            >
              <span
                className={`${
                  setsForm.showWelcome ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          )}
        </div>
        <div className="flex mt-4 justify-between">
          <p>Click to copy hidden passwords</p>
          {loading.copyHidden || allLoading ? (
            <div className="animate-spin mr-6">~</div>
          ) : (
            <Switch
              checked={setsForm.copyHidden}
              onChange={() => handleChange("copyHidden")}
              className={`${
                setsForm.copyHidden ? "bg-blueMain" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full mx-2 focus:outline-none focus:ring focus:ring-gray-500`}
            >
              <span
                className={`${
                  setsForm.copyHidden ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          )}
        </div>
        <div className="flex my-4 justify-between">
          <p>One-click delete (skip delete warning)</p>
          {loading.skipDeleteWarn || allLoading ? (
            <div className="animate-spin mr-6">~</div>
          ) : (
            <Switch
              checked={setsForm.skipDeleteWarn}
              onChange={() => {
                handleChange("skipDeleteWarn");
              }}
              className={`${
                setsForm.skipDeleteWarn ? "bg-blueMain" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full mx-2 focus:outline-none focus:ring focus:ring-gray-500`}
            >
              <span
                className={`${
                  setsForm.skipDeleteWarn ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          )}
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

      <button
        onClick={handleReset}
        className="w-full text-left p-1 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-500"
      >
        Restore Default Settings
      </button>

      {/* Below are tools - should probably open a third screen like the add/edit flows */}
      <button
        // onClick={handleReset}
        className="w-full text-left p-1 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-500"
      >
        Export Vault
      </button>

      <button
        // onClick={handleReset}
        className="w-full text-left p-1 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-500"
      >
        Cycle passwords
      </button>
    </div>
  );
};

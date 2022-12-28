import React, { useContext, useEffect, useState } from "react";
import { Dialog, Switch } from "@headlessui/react";

import { UrbitContext } from "../../store/contexts/urbitContext";
import { SettingsContext } from "../../store/contexts/settingsContext";
import settingsActions from "../../store/actions/settingsActions";

export const Settings = () => {
  const [urbitApi] = useContext(UrbitContext);
  const [settingsState, settingsDispatch] = useContext(SettingsContext);
  const [setsForm, setSetsForm] = useState(settingsState);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(false);
  const { closeSettings, setSettings } = settingsActions;

  useEffect(() => {
    setSetsForm(settingsState);
  }, [settingsState]);

  const handleScry = (setting) => {
    if (setting)
      setLoading({
        ...loading,
        [setting]: true,
      });

    urbitApi
      .scry({
        app: "knox",
        path: "/settings",
      })
      .then((res) => {
        setLoading({ ...loading, [setting]: false });
        settingsDispatch(setSettings(res.settings));
      })
      .catch(() => handleError());
  };

  const handleChange = (setting) => {
    setLoading({
      ...loading,
      [setting]: true,
    });

    // TODO: will need to add to this to handle non-boolean values (themes?)
    const getValue = () => {
      if (setsForm[setting]) return !setsForm[setting];
      else return true;
    };

    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          sett: {
            "setting-key": setting,
            "setting-val": `${getValue()}`,
          },
        },
      })
      .then(() => handleScry(setting))
      .catch(() => handleError(setting));
  };

  const handleError = (setting) => {
    setLoading({
      ...loading,
      [setting]: false,
    });
    setError(true);
  };

  return (
    <Dialog
      open={settingsState.settingsOpen}
      onClose={() => settingsDispatch(closeSettings())}
    >
      <div className="fixed inset-0 flex flex-col items-center justify-center h-screen">
        <div className="border border-black border-t-4 bg-white rounded-md w-[95%] sm:w-[450px] shadow-lg">
          <div className="flex flex-col items-center h-[100%] pt-1">
            <button
              onClick={() => settingsDispatch(closeSettings())}
              className="p-1 mr-2 self-end"
            >
              <ion-icon name="close" />
            </button>
            <Dialog.Title className="text-xl">Knox settings</Dialog.Title>

            <div className="my-12 w-[85%]">
              <div className="flex my-4 justify-between">
                <p>Show welcome screen</p>
                {!loading.showWelcome ? (
                  <Switch
                    checked={setsForm.showWelcome}
                    onChange={() => handleChange("showWelcome")}
                    className={`${
                      setsForm.showWelcome ? "bg-blueMain" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full mx-2`}
                  >
                    <span
                      className={`${
                        setsForm.showWelcome ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                ) : (
                  <div className="animate-spin mr-6">~</div>
                )}
              </div>
              <div className="flex mt-4 justify-between">
                <p>Click to copy hidden passwords</p>
                {!loading.copyHidden ? (
                  <Switch
                    checked={setsForm.copyHidden}
                    onChange={() => handleChange("copyHidden")}
                    className={`${
                      setsForm.copyHidden ? "bg-blueMain" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full mx-2`}
                  >
                    <span
                      className={`${
                        setsForm.copyHidden ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                ) : (
                  <div className="animate-spin mr-6">~</div>
                )}
              </div>
              <div className="flex my-4 justify-between">
                <p>One-click delete (skip delete warning)</p>
                <Switch
                  checked={setsForm.skipDeleteWarn}
                  onChange={() => {
                    handleChange("skipDeleteWarn");
                  }}
                  className={`${
                    setsForm.skipDeleteWarn ? "bg-blueMain" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full mx-2`}
                >
                  <span
                    className={`${
                      setsForm.skipDeleteWarn
                        ? "translate-x-6"
                        : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
            </div>

            {error && (
              <button className="my-1 w-[75%] border border-black p-1 rounded bg-red-400">
                Something went wrong. Try again.
              </button>
            )}
            <button
              onClick={() => settingsDispatch(closeSettings())}
              className="mt-1 w-[75%] border border-black p-1 rounded"
            >
              Done
            </button>
            <button
              // TODO: wire up the reset all, need new knox action for this I think
              onClick={() => setError(!error)}
              className="mt-1 mb-12 w-[75%] border border-black p-1 rounded"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

import React, { useEffect, useContext } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import { UrbitContext } from "./store/contexts/urbitContext";
import { SettingsContext } from "./store/contexts/settingsContext";
import settingsActions from "./store/actions/settingsActions";

import { WelcomeDialog } from "./components/dialogs/welcomeDialog";
import { Login } from "./components/dialogs/login";
import { Vault } from "./components/vault";

export const App = () => {
  const navigate = useNavigate();

  const [urbitApi] = useContext(UrbitContext);
  const [, settingsDispatch] = useContext(SettingsContext);
  const { setSettings } = settingsActions;

  useEffect(() => {
    getSettings();
  }, []);

  const getSettings = () => {
    urbitApi
      .scry({
        app: "knox",
        path: "/settings",
      })
      .then((res) => handleScry(res))
      // TODO: use this to set an error?
      .catch((err) => console.log("err", err));
  };

  const handleScry = (res) => {
    if (res.settings) {
      const showWelcome = res.settings.find((set) => {
        if (set["showWelcome"]) return set["showWelcome"];
      });
      if (
        !res.settings.length ||
        (showWelcome && Object.values(showWelcome).includes("true"))
      ) {
        if (!res.settings.length) {
          setWelcome();
          navigate("/apps/knox/welcome");
        } else {
          settingsDispatch(setSettings(res.settings));
          navigate("/apps/knox/welcome");
        }
      } else {
        settingsDispatch(setSettings(res.settings));
      }
    }
  };

  const setWelcome = () => {
    // TODO: set copy password on hidden default
    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          sett: {
            "setting-key": "showWelcome",
            "setting-val": "true",
          },
        },
      })
      // TODO: handle this error?
      .catch(() => console.log("err", err));
  };
  return (
    <main className="flex justify-center h-screen">
      <Routes>
        <Route
          path="/apps/knox/welcome"
          exact={true}
          element={<WelcomeDialog />}
        />
        <Route path="/apps/knox/login" exact={true} element={<Login />} />
        <Route path={"/apps/knox/"} exact={true} element={<Vault />} />
      </Routes>
    </main>
  );
};

import React, { useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { UrbitContext } from "./store/contexts/urbitContext";
import { SettingsContext } from "./store/contexts/settingsContext";
import settingsActions from "./store/actions/settingsActions";

import { WelcomeDialog } from "./components/dialogs/welcomeDialog";
import { Login } from "./components/dialogs/login";
import { Home } from "./components/home";

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
      settingsDispatch(setSettings(res.settings));
      const showWelcome = res.settings.find((set) => set["showWelcome"]);
      if (Object.values(showWelcome).includes("true"))
        navigate("/apps/knox/welcome");
    }
  };

  return (
    <main className="h-screen p-2">
      <Routes>
        <Route
          path="/apps/knox/welcome"
          exact={true}
          element={<WelcomeDialog />}
        />
        <Route path="/apps/knox/login" exact={true} element={<Login />} />
        <Route path={"/apps/knox/"} exact={true} element={<Home />} />
      </Routes>
    </main>
  );
};

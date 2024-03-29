import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as bcrypt from "bcryptjs";
import { Tab } from "@headlessui/react";

import { UrbitContext } from "../../store/contexts/urbitContext";
import { getSecret, storeSecret } from "../../utils";

export const WelcomeDialog = () => {
  const [urbitApi] = useContext(UrbitContext);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [secret, setSecret] = useState("");
  const [secret2, setSecret2] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [showSecret2, setShowSecret2] = useState(false);
  const [showSecretThatYouSet, setShowSecretThatYouSet] = useState(false);
  const [secretValidation, setSecretValidation] = useState(false);
  const [saveSecretEnabled, setSaveSecretEnabled] = useState(false);
  const [secretSuccess, setSecretSuccess] = useState(null);
  const [secretError, setSecretError] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [settingsError, setSettingsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    urbitApi
      .scry({
        app: "knox",
        path: "/secret",
      })
      .then((res) => {
        if (res.secret) setSecretSuccess(true);
      });
  }, []);

  useEffect(() => {
    if (secret === secret2) return setSecretValidation(true);
    else return setSecretValidation(false);
  }, [secret, secret2]);

  useEffect(() => {
    if (secretValidation) {
      if (secret.length && secret2.length) return setSaveSecretEnabled(true);
    } else return setSaveSecretEnabled(false);
  }, [secretValidation]);

  const handleSaveSettings = () => {
    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          sett: {
            "setting-key": "showWelcome",
            "setting-val": "false",
          },
        },
      })
      .then(() => navigate("/apps/knox/login"))
      .catch(() => setSettingsError(true));
  };

  const handleNext = () => {
    if (selectedIndex === 3) {
      if (dontShow) handleSaveSettings();
      else navigate("/apps/knox/");
    } else setSelectedIndex(selectedIndex + 1);
  };

  const handleSecret = (e) => {
    setSecret(e.target.value);
  };

  const handleSecret2 = (e) => {
    setSecret2(e.target.value);
  };

  const handleSaveSecret = (secret) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(secret, salt);

    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          secret: {
            "secret-hash": hash,
          },
        },
      })
      .then(() => {
        setSecret("");
        setSecret2("");
        setSecretSuccess(true);
        storeSecret(secret);
      })
      .catch(() => setSecretError(true));
  };

  return (
    // border-2 sm:border-red-400 md:border-green-400 lg:border-yellow-400 xl:border-purple-500
    <div className="w-full h-full flex justify-center pt-2 sm:pt-6 md:pt-8">
      <div className="w-full h-[480px] sm:w-[80%] sm:min-h-[65%] lg:min-h-[50%] lg:w-[60%] xl:w-[50%] xxl:w-[40%]">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List>
            <Tab className="w-1/4 focus:outline-none focus:ring focus:ring-gray-500 rounded">
              {({ selected }) => (
                <div
                  className={
                    selected
                      ? "rounded-t-md bg-white text-white border-t-4 border-l-2 border-r border-black focus:outline-none"
                      : "bg-black text-black border-l border-r border-black"
                  }
                >
                  ...
                </div>
              )}
            </Tab>
            <Tab className="w-1/4 focus:outline-none focus:ring focus:ring-gray-500 rounded">
              {({ selected }) => (
                <div
                  className={
                    selected
                      ? "rounded-t-md bg-white text-white border-t-4 border-l border-r border-black"
                      : "bg-black text-black border-l border-r border-black"
                  }
                >
                  ...
                </div>
              )}
            </Tab>
            <Tab className="w-1/4 focus:outline-none focus:ring focus:ring-gray-500 rounded">
              {({ selected }) => (
                <div
                  className={
                    selected
                      ? "rounded-t-md bg-white text-white border-t-4 border-l border-r border-black"
                      : "bg-black text-black border-l border-r border-black"
                  }
                >
                  ...
                </div>
              )}
            </Tab>
            <Tab className="w-1/4 focus:outline-none focus:ring focus:ring-gray-500 rounded">
              {({ selected }) => (
                <div
                  className={
                    selected
                      ? "rounded-t-md bg-white text-white border-t-4 border-l border-r-2 border-black"
                      : "bg-black text-black border-l border-r border-black"
                  }
                >
                  ...
                </div>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="border-l-2 border-r-2 border-b-2 border-black bg-white h-full w-full">
            <div className="w-full h-full px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-6 md:px-10 md:pt-12 md:pb-8 lg:px-12 lg:pt-14 lg:pb-10 flex flex-col justify-between">
              <Tab.Panel className="focus:outline-none focus:ring focus:ring-gray-500 rounded text-justify">
                Welcome to <span className="font-bold">Knox</span>, a vault for
                your web2 passwords. <br />
                <br />
                <br />
                Knox is still beta software. As security improvements to Urbit
                are made (see{" "}
                <a
                  href="https://roadmap.urbit.org/project/userspace-permissioning"
                  target="_blank"
                  className="underline focus:outline-none focus:ring focus:ring-gray-500"
                >
                  userspace permissioning
                </a>
                , for example), Knox will probably change.
                <br />
                <br />
                <span className="font-bold">
                  For now, this means you should treat this app as insecure and
                  should not save any sensitive information in it.
                </span>
                <br />
                <br />
              </Tab.Panel>
              <Tab.Panel className="focus:outline-none focus:ring focus:ring-gray-500 rounded text-justify">
                For now, none of your raw information (including your secret
                cipher) is actually saved to your urbit - Knox entries are
                encrypted and decrypted client side, and your raw secret is only
                ever saved to session storage.
                <br />
              </Tab.Panel>
              <Tab.Panel className="focus:outline-none focus:ring focus:ring-gray-500 rounded text-justify">
                Here you will set the secret used to encrypt all your saved
                entries.
                <br />
                <br />
                Do not forget this, write it down or something.
                <br />
                <br />
                The ability to change your secret, along with more advanced uses
                like cycling all your saved passwords, is coming post v0.1.0.
                <br />
                <br />
                Set your secret here:
                <div className="mt-1 mb-4">
                  <input
                    className={`border border-black p-1 w-[60%] mt-2 focus:outline-none focus:ring focus:ring-gray-500 ${
                      !secretValidation ? "border border-red-400" : null
                    }`}
                    placeholder="secret"
                    onChange={handleSecret}
                    value={secret}
                    type={!showSecret ? "password" : null}
                  />
                  <div className="inline ml-2">
                    <button
                      className="border border-black p-1 px-2 focus:outline-none focus:ring focus:ring-gray-500"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? "hide" : "show"}
                    </button>
                  </div>
                  <input
                    className={`border border-black p-1 w-[60%] mt-2 focus:outline-none focus:ring focus:ring-gray-500 ${
                      !secretValidation ? "border border-red-400" : null
                    }`}
                    placeholder="confirm your secret"
                    onChange={handleSecret2}
                    value={secret2}
                    type={!showSecret2 ? "password" : null}
                  />
                  <div className="inline ml-2">
                    <button
                      className="border border-black p-1 px-2 focus:outline-none focus:ring focus:ring-gray-500"
                      onClick={() => setShowSecret2(!showSecret2)}
                    >
                      {showSecret2 ? "hide" : "show"}
                    </button>
                    <button
                      disabled={!saveSecretEnabled}
                      className={`border border-black p-1 px-2 ml-2 focus:outline-none focus:ring focus:ring-gray-500 ${
                        saveSecretEnabled ? null : "text-gray-400"
                      }`}
                      onClick={() => handleSaveSecret(secret)}
                    >
                      save
                    </button>
                    {secretSuccess && (
                      <div className="ml-2 inline">
                        <ion-icon name="checkmark-sharp" />
                      </div>
                    )}
                  </div>
                  {secretError && (
                    <button
                      disabled
                      className="mt-3 px-2 border border-black p-1 rounded bg-red-400 text-left"
                    >
                      Something went wrong saving your secret. Try again
                    </button>
                  )}
                </div>
                <div>
                  <button
                    onClick={() =>
                      setShowSecretThatYouSet(!showSecretThatYouSet)
                    }
                    className="border border-black p-1 px-2 mt-1 focus:outline-none focus:ring focus:ring-gray-500"
                  >
                    {showSecretThatYouSet ? (
                      <span>Hide</span>
                    ) : (
                      <span>Show me</span>
                    )}{" "}
                    my secret
                  </button>
                  {showSecretThatYouSet && (
                    <p className="pt-2 inline ml-4">
                      Your secret is{" "}
                      <span className="font-bold">{getSecret()}</span>
                    </p>
                  )}
                </div>
                <br />
              </Tab.Panel>
              <Tab.Panel className="focus:outline-none focus:ring focus:ring-gray-500 rounded text-justify">
                Get Started
                {/* TODO: input align is a little off on mobile  */}
                <div className="flex mt-4">
                  <input
                    type="checkbox"
                    checked={dontShow}
                    onChange={() => setDontShow(!dontShow)}
                    className="mr-2 focus:outline-none focus:ring focus:ring-gray-500"
                  />
                  <button
                    onClick={() => setDontShow(!dontShow)}
                    className="focus:outline-none focus:ring focus:ring-gray-500 rounded"
                  >
                    Don't show this welcome again
                  </button>
                </div>
                {settingsError && (
                  <button
                    disabled
                    className="mt-3 px-2 border border-black p-1 rounded bg-red-400 text-left"
                  >
                    Something went wrong saving settings. <br /> Unselect or try
                    again.
                  </button>
                )}
              </Tab.Panel>

              <div className="flex justify-end">
                <button
                  disabled={selectedIndex === 0}
                  className={`mr-2 ${
                    selectedIndex === 0 ? `text-gray-300` : ""
                  } focus:outline-none focus:ring focus:ring-gray-500 rounded`}
                  onClick={() => setSelectedIndex(selectedIndex - 1)}
                >
                  back
                </button>
                <button
                  disabled={selectedIndex === 2 ? !secretSuccess : null}
                  className="ml-2 focus:outline-none focus:ring focus:ring-gray-500 rounded disabled:text-gray-300"
                  onClick={handleNext}
                >
                  next
                </button>
              </div>
            </div>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

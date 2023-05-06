import React, { useState, useContext, useEffect } from "react";

import { VaultContext } from "../../store/contexts/vaultContext";
import vaultActions from "../../store/actions/vaultActions";
import { UrbitContext } from "../../store/contexts/urbitContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import dialogActions from "../../store/actions/dialogActions";
import { aesEncrypt, getSecret, generatePassword } from "../../utils";

// TODO: kept for refernce for now, should remove completely
export const EditDialog = () => {
  const [urbitApi] = useContext(UrbitContext);
  const [, vaultDispatch] = useContext(VaultContext);
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const { closeEditing } = dialogActions;
  const { setVault } = vaultActions;

  const defaultFormState = {
    website: dialogState.editEntry.website,
    username: dialogState.editEntry.username,
    password: dialogState.editEntry.password,
  };

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);

  // set form password to password from dialog context when password is generated
  useEffect(() => {
    if (dialogState.generated)
      setFormState({
        ...formState,
        password: dialogState.generated,
      });
  }, [dialogState.generated]);

  useEffect(() => {
    setFormState({
      website: dialogState.editEntry.website,
      username: dialogState.editEntry.username,
      password: dialogState.editEntry.password,
    });
  }, [dialogState.editEntry]);

  // TODO: validate form - improve this
  useEffect(() => {
    if (formState.website && formState.username && formState.password)
      setDisabled(false);
    else setDisabled(true);
  }, [formState]);

  // clear error after 7 seconds, close dialog on success after 4 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dialogDispatch(closeEditing()), 4000);
      return () => clearTimeout(timer);
    }
    if (error) setTimeout(() => setError(false), 7000);
  }, [success, error]);

  // clear copied icon
  useEffect(() => {
    if (copied) setTimeout(() => setCopied(false), 3500);
  }, [copied]);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = () => {
    generatePassword(dialogDispatch, urbitApi);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formState.password);
    setCopied(true);
  };

  const handleSuccess = () => {
    setSuccess(true);
    setDisabled(true);
    setLoading(false);
    handleScry();
  };

  const handleError = (err) => {
    setLoading(false);
    setError(true);
  };

  const handleEdit = () => {
    setLoading(true);
    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          edit: {
            website: aesEncrypt(formState.website, getSecret()),
            username: aesEncrypt(formState.username, getSecret()),
            password: aesEncrypt(formState.password, getSecret()),
            id: parseInt(dialogState.editEntry.id),
          },
        },
      })
      .then(() => handleSuccess())
      .catch((err) => handleError(err));
  };

  const handleScry = () => {
    urbitApi
      .scry({
        app: "knox",
        path: "/vault",
      })
      .then((res) => vaultDispatch(setVault(res.vault)))
      // TODO: handle this error?
      .catch((err) => console.log("err", err));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-timberwolf h-1/2">
        <div className="flex flex-col items-center h-[100%]">
          <div className="flex w-full justify-between items-center px-2 h-12">
            <p className="text-l">Edit this entry</p>
            <button
              onClick={() => dialogDispatch(closeEditing())}
              className="flex items-center mr-2 hover:scale-150 focus:outline-none focus:ring focus:ring-gray-500 rounded"
            >
              <ion-icon name="close" />
            </button>
          </div>
          <div className="border-t border-black w-full pt-2 flex flex-col items-center">
            <input
              className="my-1 w-[75%] border border-black p-1 focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="website"
              name="website"
              value={formState.website}
              onChange={handleChange}
            />
            <input
              className="my-1 w-[75%] border border-black p-1 focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="username"
              name="username"
              value={formState.username}
              onChange={handleChange}
            />
            <div className="w-3/4 flex justify-between items-center">
              <input
                className="my-1 border border-black p-1 w-full focus:outline-none focus:ring focus:ring-gray-500"
                placeholder="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                type={!showPass ? "password" : ""}
              />
              {copied && <ion-icon id="dialog-copy" name="copy-outline" />}
              <button
                onClick={() => setShowPass(!showPass)}
                className="pl-1 focus:outline-none focus:ring focus:ring-gray-500"
              >
                {!showPass ? "show" : "hide"}
              </button>
            </div>
            <button
              onClick={handleGenerate}
              className="mt-1 mb-6 w-[75%] border border-black p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-500"
            >
              Generate
            </button>

            {!success ? (
              <button
                className={`my-1 w-[75%] border border-black p-1 rounded flex justify-center hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-500 ${
                  !loading && "disabled:opacity-25 disabled:pointer-events-none"
                }`}
                onClick={handleEdit}
                disabled={loading || disabled}
              >
                {!loading ? "Save" : <div className="animate-spin">~</div>}
              </button>
            ) : (
              <button
                disabled
                className="my-1 w-[75%] border border-black p-1 rounded bg-green-400 pointer-events-none"
              >
                Success
              </button>
            )}
            {error && (
              <button
                disabled
                className="my-1 w-[75%] border border-black p-1 rounded bg-red-400 pointer-events-none"
              >
                Something went wrong. Try again.
              </button>
            )}
            {!error && Boolean(formState?.password?.length) && (
              <button
                onClick={handleCopy}
                className="mt-1 mb-6 w-[75%] border border-black p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-500 rounded"
              >
                Copy password
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

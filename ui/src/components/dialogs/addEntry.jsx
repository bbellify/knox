import React, { useState, useContext, useEffect } from "react";

import VaultContext from "../../store/contexts/vaultContext";
import vaultActions from "../../store/actions/vaultActions";
import { UrbitContext } from "../../store/contexts/urbitContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import dialogActions from "../../store/actions/dialogActions";
import { aesEncrypt, generatePassword, getSecret } from "../../utils";

const defaultFormState = {
  website: "",
  username: "",
  password: "",
};

export const AddEntry = () => {
  const [urbitApi] = useContext(UrbitContext);
  const [, vaultDispatch] = useContext(VaultContext);
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);
  const [passHidden, setPassHidden] = useState(true);

  const { closeAdd } = dialogActions;
  const { setVault } = vaultActions;

  // set form password to password from dialog context when password is generated
  useEffect(() => {
    if (dialogState.generated)
      setFormState({
        ...formState,
        password: dialogState.generated,
      });
  }, [dialogState.generated]);

  // TODO: validate form - improve this
  useEffect(() => {
    if (formState.website && formState.username && formState.password)
      setDisabled(false);
    else setDisabled(true);
  }, [formState]);

  // clear error after 7 seconds, clear form on success after 4 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dialogDispatch(closeAdd()), 4000);
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

  const handleShowPass = () => {
    setPassHidden(!passHidden);
  };

  const handleSuccess = () => {
    setSuccess(true);
    setDisabled(true);
    setLoading(false);
    handleScry();
    dialogDispatch(closeAdd());
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
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

  const handleAdd = () => {
    setLoading(true);
    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          add: {
            website: aesEncrypt(formState.website, getSecret()),
            username: aesEncrypt(formState.username, getSecret()),
            password: aesEncrypt(formState.password, getSecret()),
          },
        },
      })
      .then(() => handleSuccess())
      .catch((err) => handleError(err));
  };

  return (
    <tr className="bg-whiteSmoke border-b border-gray-300 bg-timberwolf hover:bg-whiteSmoke">
      {/* website */}
      <td className="p-2">
        <div className="flex justify-center items-center">
          <input
            autoFocus
            name="website"
            value={formState.website}
            onChange={handleChange}
            className="text-font py-2 sm:px-4 hover:bg-gray-200 max-w-full overflow-x-auto focus:outline-none focus:ring focus:ring-gray-500 rounded"
          />
        </div>
      </td>

      {/* username */}
      <td className="p-2">
        <div className="flex justify-center items-center">
          <input
            name="username"
            value={formState.username}
            onChange={handleChange}
            className="text-font py-2 sm:px-4 hover:bg-gray-200 max-w-full overflow-x-auto focus:outline-none focus:ring focus:ring-gray-500 rounded"
          />
        </div>
      </td>

      {/* password */}
      <td className="p-2">
        <div className="flex justify-center items-center">
          <input
            name="password"
            type={passHidden ? "password" : null}
            value={formState.password}
            onChange={handleChange}
            className="text-font py-2 sm:px-4 hover:bg-gray-200 max-w-full overflow-x-auto focus:outline-none focus:ring focus:ring-gray-500 rounded"
          />
        </div>
      </td>

      {/* view button */}
      <td className="text-center">
        <button
          onClick={handleShowPass}
          className="hover:scale-125 focus:outline-none focus:ring focus:ring-gray-500 rounded"
        >
          {passHidden ? <ion-icon name="eye" /> : <ion-icon name="eye-off" />}
        </button>
      </td>

      {/* edit buttons */}
      <td className="text-center">
        <div className="whitespace-nowrap">
          <button
            onClick={handleAdd}
            disabled={disabled}
            className={`pr-1 md:px-2 focus:outline-none focus:ring focus:ring-gray-500 rounded disabled:pointer-events-none ${
              !disabled && "hover:scale-125"
            }`}
          >
            <ion-icon
              name="checkmark-sharp"
              id={disabled ? "check-disabled" : ""}
            />
          </button>
          <button
            onClick={() => dialogDispatch(closeAdd())}
            className="pl-1 md:px-2 hover:scale-125 focus:outline-none focus:ring focus:ring-gray-500 rounded"
          >
            <ion-icon name="close" />
          </button>
        </div>
      </td>
    </tr>
  );
};

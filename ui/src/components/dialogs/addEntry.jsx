import React, { useState, useContext, useEffect } from "react";

import VaultContext from "../../store/contexts/vaultContext";
import vaultActions from "../../store/actions/vaultActions";
import { UrbitContext } from "../../store/contexts/urbitContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import dialogActions from "../../store/actions/dialogActions";
import { aesEncrypt, getSecret } from "../../utils";

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
  const [error, setError] = useState(false);
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

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleShowPass = () => {
    setPassHidden(!passHidden);
  };

  const handleSuccess = () => {
    handleScry();
    dialogDispatch(closeAdd());
  };

  const handleScry = () => {
    urbitApi
      .scry({
        app: "knox",
        path: "/vault",
      })
      .then((res) => vaultDispatch(setVault(res.vault)));
  };

  const handleAdd = () => {
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
      .catch(() => setError(true));
  };

  return (
    <>
      <tr
        className={
          error
            ? "mt-1 border-t-2 border-l-2 border-r-2 border-error bg-whiteSmoke"
            : "bg-whiteSmoke border-2 border-gray-500"
        }
      >
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

        {/* view pass button */}
        <td className="text-center">
          <button
            onClick={handleShowPass}
            className="focus:outline-none focus:ring focus:ring-gray-500 rounded"
          >
            {passHidden ? (
              <ion-icon name="eye" class="icons" />
            ) : (
              <ion-icon name="eye-off" class="icons" />
            )}
          </button>
        </td>

        {/* action buttons */}
        <td className="text-center">
          <div className="whitespace-nowrap">
            <button
              onClick={handleAdd}
              disabled={disabled}
              className="pr-1 md:px-2 focus:outline-none focus:ring focus:ring-gray-500 rounded disabled:pointer-events-none"
            >
              <ion-icon
                name="checkmark-sharp"
                class="icons"
                id={disabled ? "check-disabled" : ""}
              />
            </button>
            <button
              onClick={() => dialogDispatch(closeAdd())}
              className="pl-1 md:px-2 focus:outline-none focus:ring focus:ring-gray-500 rounded"
            >
              <ion-icon name="close" class="icons" />
            </button>
          </div>
        </td>
      </tr>
      {error && (
        <tr className="border-l-2 border-r-2 border-b-2 border-error bg-whiteSmoke">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td className="flex flex-row-reverse pr-2">
            <div className="whitespace-nowrap py-2 px-1 flex">
              <p className="text-font">Something went wrong. Try again.</p>
              <button
                onClick={() => setError(false)}
                className="flex text-font items-center ml-2 focus:outline-none focus:ring focus:ring-gray-500 rounded"
              >
                <ion-icon name="close" class="icons" />
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

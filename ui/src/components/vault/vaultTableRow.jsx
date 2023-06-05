import React, { useState, useEffect, useContext } from "react";

import { UrbitContext } from "../../store/contexts/urbitContext";
import { VaultContext } from "../../store/contexts/vaultContext";
import vaultActions from "../../store/actions/vaultActions";
import { SettingsContext } from "../../store/contexts/settingsContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import dialogActions from "../../store/actions/dialogActions";
import { password } from "./password";
import { aesEncrypt, getSecret } from "../../utils";

export const VaultTableRow = (props) => {
  const { entry } = props;
  const [urbitApi] = useContext(UrbitContext);
  const [, vaultDispatch] = useContext(VaultContext);
  const { setVault } = vaultActions;
  const [settingsState] = useContext(SettingsContext);
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const { openDeleteModal, openEditing, closeEditing } = dialogActions;
  const [passHidden, setPassHidden] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState({
    site: false,
    user: false,
    pass: false,
  });
  const [editingObject, setEditingObject] = useState({
    website: "",
    username: "",
    password: "",
  });

  const editing = dialogState.editOpen && dialogState.editEntry.id === entry.id;

  // set a timeout to hide copy icon
  useEffect(() => {
    if (Object.values(copied).some((val) => val === true)) {
      setTimeout(() => {
        setCopied({ site: false, user: false, pass: false });
      }, 3500);
    }
  }, [copied]);

  useEffect(() => {
    if (editing) {
      setEditingObject(dialogState.editEntry);
    } else {
      setPassHidden(true);
    }
  }, [editing]);

  // TODO: validate form - improve this
  useEffect(() => {
    if (
      editingObject.website &&
      editingObject.username &&
      editingObject.password
    )
      setDisabled(false);
    else setDisabled(true);
  }, [editingObject]);

  const handleShowPass = () => {
    setPassHidden(!passHidden);
  };

  const handleEditChange = (e) => {
    setEditingObject({
      ...editingObject,
      [e.target.name]: e.target.value,
    });
  };

  // TODO: this doesn't work on iOS, revisit
  const handleCopy = (e) => {
    if (e.target.name !== "pass") {
      if (e.target.value) {
        navigator.clipboard.writeText(e.target.value);
        setCopied({
          [e.target.name]: true,
        });
      }
    } else {
      if (settingsState.copyHidden) {
        if (e.target.value) {
          navigator.clipboard.writeText(e.target.value);
          setCopied({
            [e.target.name]: true,
          });
        }
      } else {
        if (!passHidden) {
          if (e.target.value) {
            navigator.clipboard.writeText(e.target.value);
            setCopied({
              [e.target.name]: true,
            });
          }
        }
      }
    }
  };

  const handleDelete = (id) => {
    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          del: {
            id: id,
          },
        },
      })
      .then(() => handleScry())
      .catch(() => setError(true));
  };

  const handleSubmitEdit = () => {
    urbitApi
      .poke({
        app: "knox",
        mark: "knox-action",
        json: {
          edit: {
            website: aesEncrypt(editingObject.website, getSecret()),
            username: aesEncrypt(editingObject.username, getSecret()),
            password: aesEncrypt(editingObject.password, getSecret()),
            id: parseInt(editingObject.id),
          },
        },
      })
      .then(() => handleSuccess())
      .catch(() => setError(true));
  };

  const handleSuccess = () => {
    dialogDispatch(closeEditing());
    handleScry();
  };

  const handleScry = () => {
    urbitApi
      .scry({
        app: "knox",
        path: "/vault",
      })
      .then((res) => vaultDispatch(setVault(res.vault)));
  };

  return (
    <>
      <tr
        className={
          error
            ? "border-t-2 border-l-2 border-r-2 border-error bg-whiteSmoke"
            : editing
            ? "bg-whiteSmoke border-2 border-gray-500"
            : "border-b border-gray-300 bg-timberwolf hover:bg-whiteSmoke"
        }
      >
        {/* website */}
        <td className="p-2">
          <div className="flex justify-center items-center">
            {editing ? (
              <input
                autoFocus
                name="website"
                value={editingObject.website}
                onChange={handleEditChange}
                className="text-font py-2 sm:px-4 hover:bg-gray-200 max-w-full overflow-x-auto focus:outline-none focus:ring focus:ring-gray-500 rounded"
              />
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="text-font py-2 sm:px-4 hover:bg-gray-200 max-w-full overflow-x-auto focus:outline-none focus:ring focus:ring-gray-500 rounded"
                  value={entry.website}
                  name="site"
                >
                  {entry.website}
                </button>
                {copied.site && <ion-icon id="copy-icon" name="copy-outline" />}
              </>
            )}
          </div>
        </td>

        {/* username */}
        <td className="p-2">
          <div className="flex justify-center items-center">
            {editing ? (
              <input
                name="username"
                value={editingObject.username}
                onChange={handleEditChange}
                className="text-font py-2 sm:px-4 hover:bg-gray-200 max-w-full overflow-x-auto focus:outline-none focus:ring focus:ring-gray-500 rounded"
              />
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="text-font py-2 sm:px-4 hover:bg-gray-200 max-w-full overflow-x-auto focus:outline-none focus:ring focus:ring-gray-500 rounded"
                  value={entry.username}
                  name="user"
                >
                  {entry.username}
                </button>
                {copied.user && <ion-icon id="copy-icon" name="copy-outline" />}
              </>
            )}
          </div>
        </td>

        {/* password */}
        <td className="py-2">
          <div className="flex justify-center items-center">
            {editing ? (
              <input
                type={passHidden ? "password" : null}
                name="password"
                value={editingObject.password}
                onChange={handleEditChange}
                className="text-font py-2 sm:px-4 hover:bg-gray-200 max-w-full overflow-x-auto focus:outline-none focus:ring focus:ring-gray-500 rounded"
              />
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="py-2 px-2 hover:bg-gray-200 z-0 max-w-full overflow-x-auto whitespace-nowrap focus:outline-none focus:ring focus:ring-gray-500 rounded"
                  value={entry.password}
                  name="pass"
                >
                  {passHidden ? password() : entry.password}
                </button>
                {copied.pass && <ion-icon id="copy-icon" name="copy-outline" />}
              </>
            )}
          </div>
        </td>

        {/* view button */}
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

        {/* edit buttons */}
        <td className="text-center">
          {!editing ? (
            <div className="whitespace-nowrap">
              <button
                onClick={() => dialogDispatch(openEditing(entry))}
                className="pr-1 md:px-2 focus:outline-none focus:ring focus:ring-gray-500 rounded"
              >
                <ion-icon name="pencil" class="icons" />
              </button>
              <button
                onClick={
                  settingsState.skipDeleteWarn
                    ? () => handleDelete(entry.id)
                    : () => dialogDispatch(openDeleteModal(entry.id))
                }
                className="pl-1 md:px-2 focus:outline-none focus:ring focus:ring-gray-500 rounded"
              >
                <ion-icon name="trash" class="icons" />
              </button>
            </div>
          ) : (
            <div className="whitespace-nowrap">
              <button
                disabled={disabled}
                onClick={handleSubmitEdit}
                className="pr-1 md:px-2 focus:outline-none focus:ring focus:ring-gray-500 rounded disabled:pointer-events-none"
              >
                <ion-icon
                  name="checkmark-sharp"
                  class="icons"
                  id={disabled ? "check-disabled" : null}
                />
              </button>
              <button
                onClick={() => {
                  if (error) setError(false);
                  dialogDispatch(closeEditing());
                }}
                className="pl-1 md:px-2 focus:outline-none focus:ring focus:ring-gray-500 rounded"
              >
                <ion-icon name="close" class="icons" />
              </button>
            </div>
          )}
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

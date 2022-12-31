import React, { useState, useEffect, useContext } from "react";

import { UrbitContext } from "../../store/contexts/urbitContext";
import { VaultContext } from "../../store/contexts/vaultContext";
import vaultActions from "../../store/actions/vaultActions";
import { SettingsContext } from "../../store/contexts/settingsContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import dialogActions from "../../store/actions/dialogActions";
import { password } from "./password";

// TODO: need to get settings from settings context, change what happens with delete button accordingly
// show warning ? modal : just delete
export const VaultTableRow = (props) => {
  const { entry } = props;
  const [urbitApi] = useContext(UrbitContext);
  const [, vaultDispatch] = useContext(VaultContext);
  const { setVault } = vaultActions;
  const [settingsState] = useContext(SettingsContext);
  const [, dialogDispatch] = useContext(DialogContext);
  const { openDeleteDialog, openEditDialog } = dialogActions;

  const defaultCopied = {
    site: false,
    user: false,
    pass: false,
  };

  const [passHidden, setPassHidden] = useState(true);
  const [copied, setCopied] = useState(defaultCopied);

  const handleShowPass = () => {
    setPassHidden(!passHidden);
  };

  // set a timeout to hide copy icon
  useEffect(() => {
    if (Object.values(copied).some((val) => val === true)) {
      setTimeout(() => {
        setCopied(defaultCopied);
      }, 3500);
    }
  }, [copied]);

  // TODO: this doesn't work on iOS, revisit
  const handleCopy = (e) => {
    if (e.target.name !== "pass") {
      if (e.target.value) {
        navigator.clipboard.writeText(e.target.value);
        setCopied({
          ...copied,
          [e.target.name]: true,
        });
      }
    } else {
      if (settingsState.copyHidden) {
        if (e.target.value) {
          navigator.clipboard.writeText(e.target.value);
          setCopied({
            ...copied,
            [e.target.name]: true,
          });
        }
      } else {
        if (!passHidden) {
          if (e.target.value) {
            navigator.clipboard.writeText(e.target.value);
            setCopied({
              ...copied,
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
      // TODO: handle this error?
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
    <>
      <tr className="bg-white hover:bg-gray-100 border-b">
        <td className="p-2">
          <div className="flex justify-center items-center">
            <button
              onClick={handleCopy}
              className="py-2 sm:px-4 hover:bg-gray-200 max-w-full overflow-x-auto focus:outline-none focus:ring focus:ring-gray-500 rounded"
              value={entry.website}
              name="site"
            >
              {entry.website}
            </button>
            {copied.site && <ion-icon id="copy-icon" name="copy-outline" />}
          </div>
        </td>

        <td className="p-2">
          <div className="flex justify-center items-center">
            <button
              onClick={handleCopy}
              className="py-2 sm:px-4 hover:bg-gray-200 max-w-full overflow-x-auto focus:outline-none focus:ring focus:ring-gray-500 rounded"
              value={entry.username}
              name="user"
            >
              {entry.username}
            </button>
            {copied.user && <ion-icon id="copy-icon" name="copy-outline" />}
          </div>
        </td>

        {/*
         * TODO: right now can copy password even if hidden
         * might be a nice thing to add to settings
         */}
        <td className="py-2">
          <div className="flex justify-center items-center">
            <button
              onClick={handleCopy}
              className="py-2 px-2 hover:bg-gray-200 z-0 max-w-full overflow-x-auto whitespace-nowrap focus:outline-none focus:ring focus:ring-gray-500 rounded"
              value={entry.password}
              name="pass"
            >
              {passHidden ? password() : entry.password}
            </button>
            {copied.pass && <ion-icon id="copy-icon" name="copy-outline" />}
          </div>
        </td>

        <td className="text-center">
          <button
            onClick={handleShowPass}
            className="hover:scale-125 focus:outline-none focus:ring focus:ring-gray-500 rounded"
          >
            {passHidden ? <ion-icon name="eye" /> : <ion-icon name="eye-off" />}
          </button>
        </td>

        <td className="text-center">
          {/* TODO: Delete button here next to edit now. Should come back to this UX */}
          <div className="whitespace-nowrap">
            <button
              onClick={() => dialogDispatch(openEditDialog(entry))}
              className="pr-1 md:px-2 hover:scale-125 focus:outline-none focus:ring focus:ring-gray-500 rounded"
            >
              <ion-icon name="pencil" />
            </button>
            <button
              onClick={
                settingsState.skipDeleteWarn
                  ? () => handleDelete(entry.id)
                  : () => dialogDispatch(openDeleteDialog(entry.id))
              }
              className="pl-1 md:px-2 hover:scale-125 focus:outline-none focus:ring focus:ring-gray-500 rounded"
            >
              <ion-icon name="trash" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

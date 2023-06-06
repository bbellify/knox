import React, { useContext, useState, useEffect } from "react";

import { UrbitContext } from "../../store/contexts/urbitContext";
import { VaultContext } from "../../store/contexts/vaultContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import { SettingsContext } from "../../store/contexts/settingsContext";
import dialogActions from "../../store/actions/dialogActions";
import { generatePassword } from "../../utils";

export const Actions = () => {
  const [generated, setGenerated] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);
  const [generatedCopied, setGeneratedCopied] = useState(false);

  const [urbitApi] = useContext(UrbitContext);
  const [vaultState] = useContext(VaultContext);
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const [settingsState] = useContext(SettingsContext);
  const { openAdd, setGenerated: setGenDialog } = dialogActions;

  // set form password to password from dialog context when password is generated
  useEffect(() => {
    setGenerated(dialogState.generated);
  }, [dialogState.generated]);

  const handleCopy = (e) => {
    if (e.target.value) {
      navigator.clipboard.writeText(e.target.value);
      setGeneratedCopied(true);
    }
  };

  const handleDice = () => {
    if (!showGenerated) setShowGenerated(true);
    generatePassword(dialogDispatch, urbitApi);
  };

  const handleClose = () => {
    dialogDispatch(setGenDialog(""));
    setShowGenerated(false);
  };

  useEffect(() => {
    if (generatedCopied) {
      setTimeout(() => {
        setGeneratedCopied(false);
      }, 3500);
    }
  }, [generatedCopied]);

  // close generated when opening a dialog, add to if necessary
  useEffect(() => {
    if (
      dialogState.addOpen ||
      dialogState.editOpen ||
      dialogState.deleteOpen ||
      dialogState.infoOpen
    ) {
      setGenerated("");
      setShowGenerated(false);
    }
    if (settingsState.settingsOpen) {
      setGenerated("");
      dialogDispatch(setGenDialog(""));
      setShowGenerated(false);
    }
  }, [
    dialogState.addOpen,
    dialogState.editOpen,
    dialogState.deleteOpen,
    dialogState.infoOpen,
    settingsState,
  ]);

  return (
    /*
     * TODO: should refactor the small screen view so so much space
     * isn't taken up by action buttons, search, etc
     */
    <div className="flex w-full">
      {/* action buttons */}
      <div className="flex">
        <button
          className="text-xl font-bold px-2 focus:outline-none focus:ring focus:ring-gray-500 rounded"
          onClick={handleDice}
        >
          <ion-icon name="dice-outline" class="icons" />
        </button>
        <button
          className="text-xl font-bold px-2 focus:outline-none focus:ring focus:ring-gray-500 rounded"
          onClick={() => dialogDispatch(openAdd())}
        >
          <ion-icon name="add" class="icons" />
        </button>
      </div>
      {showGenerated && generated && !dialogState.addOpen && (
        <div className="flex w-full justify-center py-2">
          <button
            onClick={handleCopy}
            className="border border-black shadow px-12 bg-white hover:bg-gray-200 overflow-x-auto rounded w-1/3 text-sm focus:outline-none focus:ring focus:ring-gray-500"
            value={generated}
          >
            {generated}
          </button>
          <div className="flex items-center">
            {generatedCopied && (
              <ion-icon
                id="generated-copy-icon"
                name="copy-outline"
                className="pl-2"
              />
            )}
            <button
              className="flex text-xl font-bold ml-2 focus:outline-none focus:ring focus:ring-gray-500 rounded position-center"
              onClick={() => dialogDispatch(openAdd())}
            >
              <ion-icon name="add" class="icons" />
            </button>
            <button
              onClick={handleClose}
              className="flex text-xl font-bold ml-2 focus:outline-none focus:ring focus:ring-gray-500 rounded position-center"
            >
              <ion-icon name="close" class="icons" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

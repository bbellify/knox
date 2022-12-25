import React, { useContext, useState, useEffect } from "react";

import { UrbitContext } from "../../store/contexts/urbitContext";
import { VaultContext } from "../../store/contexts/vaultContext";
import { DialogContext } from "../../store/contexts/dialogContext";
import { SettingsContext } from "../../store/contexts/settingsContext";
import dialogActions from "../../store/actions/dialogActions";
import settingsActions from "../../store/actions/settingsActions";
import { generatePassword } from "../../utils";

export function Actions() {
  const [generated, setGenerated] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);
  const [generatedCopied, setGeneratedCopied] = useState(false);

  const [urbitApi] = useContext(UrbitContext);
  const [vaultState] = useContext(VaultContext);
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const [settingsState, settingsDispatch] = useContext(SettingsContext);
  const { openAddDialog, setGenerated: setGenDialog } = dialogActions;
  const { openSettings } = settingsActions;

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
      }, "3500");
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
    <div
      className={`flex pr-2 py-1 mb-1 ${
        showGenerated ? "justify-between" : "justify-end"
      }`}
    >
      {/* TODO: generated stuff - will probably change */}
      {showGenerated && (
        <div className="w-[70%] sm:max-w-[50%] flex">
          <button
            onClick={handleCopy}
            className="border border-black rounded-md shadow py-1 px-2 bg-white hover:bg-gray-200 w-[80%] overflow-x-auto"
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
            {/* TODO: have a save password flow, but could be improved */}
            <button
              className="text-xl font-bold pl-2"
              onClick={() => dialogDispatch(openAddDialog())}
            >
              <ion-icon name="add" />
            </button>
            <button onClick={handleClose} className="text-xl pl-2">
              <ion-icon name="close" />
            </button>
          </div>
        </div>
      )}
      {/* action buttons */}
      <div className="">
        <button className="text-xl font-bold px-2" onClick={handleDice}>
          <ion-icon name="dice-outline" />
        </button>
        <button
          className={`text-xl font-bold px-2 hover:scale-120 my-1 ${
            !vaultState.length &
            !(
              dialogState.addOpen ||
              dialogState.deleteOpen ||
              dialogState.editOpen ||
              dialogState.infoOpen ||
              settingsState.settingsOpen
            )
              ? "animate-bounce"
              : ""
          }`}
          onClick={() => dialogDispatch(openAddDialog())}
        >
          <ion-icon name="add" />
        </button>
        <button
          className="text-xl font-bold px-2 hover:scale-120 my-1"
          onClick={() => settingsDispatch(openSettings())}
        >
          <ion-icon name="settings-sharp" id="settings-icon" />
        </button>
      </div>
    </div>
  );
}

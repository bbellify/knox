import React, { useContext } from "react";
import { Dialog } from "@headlessui/react";

import DialogContext from "../../store/contexts/dialogContext";
import dialogActions from "../../store/actions/dialogActions";

export const InfoDialog = () => {
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const { closeInfoDialog } = dialogActions;

  return (
    <Dialog
      open={dialogState.infoOpen}
      onClose={() => dialogDispatch(closeInfoDialog())}
    >
      <div className="fixed inset-0 flex flex-col items-center justify-center h-screen">
        <div className="border border-black border-t-4 bg-white rounded-md w-[95%] sm:w-[450px] sm:h-screen60 sm:max-h-[420px] shadow-lg pb-14">
          <div className="flex flex-col items-center h-[100%] pt-1">
            <button
              onClick={() => dialogDispatch(closeInfoDialog())}
              className="p-1 mr-2 self-end hover:scale-150 focus:outline-none focus:ring focus:ring-gray-500 rounded"
            >
              <ion-icon name="close" />
            </button>
            <Dialog.Title className="text-xl">Knox Info</Dialog.Title>

            <div className="my-12">
              <h3>Info here</h3>
              <h3>Info here</h3>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

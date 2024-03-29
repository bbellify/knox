import React, { useContext } from "react";
import { Dialog } from "@headlessui/react";

import DialogContext from "../../store/contexts/dialogContext";
import dialogActions from "../../store/actions/dialogActions";

export const InfoDialog = () => {
  const [dialogState, dialogDispatch] = useContext(DialogContext);
  const { closeInfoModal } = dialogActions;

  return (
    <Dialog
      open={dialogState.infoOpen}
      onClose={() => dialogDispatch(closeInfoModal())}
    >
      <div className="fixed inset-0 flex flex-col items-center justify-center h-screen">
        <div className="border border-black border-t-4 bg-white rounded-md w-[95%] sm:w-[450px] sm:h-screen60 sm:max-h-[420px] shadow-lg pb-14">
          <div className="flex flex-col items-center h-[100%] pt-1">
            <button
              onClick={() => dialogDispatch(closeInfoModal())}
              className="p-1 mr-2 self-end focus:outline-none focus:ring focus:ring-gray-500 rounded"
            >
              <ion-icon name="close" class="icons" />
            </button>
            <Dialog.Title className="text-xl">Knox Info</Dialog.Title>

            <div className="my-12">
              <h3>Version: 0.1.0</h3>
              <h3>Created by ~wordel-sitnec</h3>
              {/* TODO */}
              <h3>
                <a
                  href="https://github.com/bbellify/knox-extension"
                  target="_blank"
                  className="underline focus:outline-none focus:ring focus:ring-gray-500"
                >
                  Knox companion extension
                </a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

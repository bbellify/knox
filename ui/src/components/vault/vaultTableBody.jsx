import React, { useContext } from "react";

import { AddEntry } from "../dialogs/addEntry";

import { DialogContext } from "../../store/contexts/dialogContext";
import { VaultTableRow } from "./vaultTableRow";

export const VaultTableBody = (props) => {
  const { vault, searchValue } = props;
  const [dialogState] = useContext(DialogContext);

  return (
    <tbody className="w-auto">
      {dialogState.addOpen && <AddEntry />}
      {!searchValue
        ? vault.map((entry, i) => {
            return <VaultTableRow key={i} entry={entry} />;
          })
        : vault.map((entry, i) => {
            if (
              entry.website.toLowerCase().includes(searchValue.toLowerCase()) ||
              entry.username.toLowerCase().includes(searchValue.toLowerCase())
            )
              return <VaultTableRow key={i} entry={entry} />;
          })}
    </tbody>
  );
};

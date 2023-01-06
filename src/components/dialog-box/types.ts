import { GridRowId } from "@mui/x-data-grid";
import { DocumentNode } from "graphql";

export interface DialogProps {
  deleteMutation: DocumentNode;
  refetchQuery: DocumentNode;
  entity: string;
  entityId: GridRowId;
  onConfirm: () => void;
  handleClose: () => void;
}

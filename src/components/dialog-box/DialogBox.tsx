import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  styled,
} from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { DocumentNode } from "@apollo/client";

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgb(84 81 81 / 15%);
  }
`;

type DialogProps = {
  deleteMutation: DocumentNode;
  refetchQuery: DocumentNode;
  entity: string;
  entityId: GridRowId;
  entityName: string;
  onConfirm: () => void;
  handleClose: () => void;
};

const DialogBox: React.FC<DialogProps> = ({
  entity,
  entityName,
  onConfirm,
  handleClose,
}) => {
  return (
    <StyledDialog
      PaperProps={{
        style: {
          boxShadow: "none",
          minWidth: "400px",
          alignItems: "center",
        },
      }}
      open={true}
      onClose={handleClose}
    >
      <DialogTitle>
        <>Delete {entity}</>
      </DialogTitle>
      <DialogContentText sx={{ width: "84%" }}>
        <>
          {" "}
          Are you sure you want to delete the {entity?.toLowerCase()}{" "}
          {entityName}?
        </>
      </DialogContentText>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button
          variant="outlined"
          sx={{
            height: "30px",
          }}
          onClick={onConfirm}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default DialogBox;

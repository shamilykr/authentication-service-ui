import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  styled,
} from "@mui/material";
import { useSetRecoilState } from "recoil";
import { GridRowId } from "@mui/x-data-grid";
import { ApolloError, DocumentNode, useMutation } from "@apollo/client";

import { apiRequestAtom, toastMessageAtom } from "../../states/apiRequestState";

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(220, 220, 220, 0.05);
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

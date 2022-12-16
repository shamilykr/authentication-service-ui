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
    background-color: #5e77993b;
    opacity: 0.4 !important;
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
          minWidth: "500px",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          minHeight: "250px",
        },
      }}
      open={true}
      onClose={handleClose}
    >
      <DialogTitle sx={{ fontFamily: "Inter" }}>
        <>Confirm the Deletion!</>
      </DialogTitle>
      <DialogContentText sx={{ width: "86%", fontFamily: "Inter" }}>
        <>
          Deleting {entity?.toLowerCase()} will remove all it’s details. Do you
          really
        </>
      </DialogContentText>
      <DialogContentText sx={{ fontFamily: "Inter" }}>
        <>want to delete the {entity?.toLowerCase()}?</>
      </DialogContentText>
      <DialogActions sx={{ mt: "27px" }}>
        <Button
          onClick={handleClose}
          sx={{
            textTransform: "none",
            fontFamily: "Manrope",
            width: "136px",
            height: "45px",
            border: "1px solid #2653F1",
            color: "#2653F1",
          }}
        >
          No, keep it
        </Button>
        <Button
          variant="contained"
          sx={{
            height: "45px",
            textTransform: "none",
            fontFamily: "Manrope",
            width: "136px",
          }}
          onClick={onConfirm}
          autoFocus
        >
          Yes, Delete it
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default DialogBox;

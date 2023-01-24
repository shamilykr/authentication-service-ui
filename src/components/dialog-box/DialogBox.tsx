import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  styled,
} from "@mui/material";

import { DialogProps } from "./types";

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: #5e7799;
    opacity: 0.4 !important;
  }
`;

const DialogBox: React.FC<DialogProps> = ({
  entity,
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
          id="delete-button"
          sx={{
            textTransform: "none",
            fontFamily: "Manrope",
            width: "136px",
            height: "45px",
            border: "1px solid #2653F1",
            color: "#2653F1",
            "&:hover": {
              color: "#2653F1",
            },
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

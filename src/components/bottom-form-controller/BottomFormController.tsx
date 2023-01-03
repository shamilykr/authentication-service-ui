import { Button } from "@mui/material";

import "./styles.css";
import { BottomControllerProps } from "./types";

const BottomFormController = (props: BottomControllerProps) => {
  const {
    primarybuttonLabel,
    onSubmit,
    formId,
    onCancel,
    secondaryButtonLabel,
  } = props;
  return (
    <div className="bottom-wrapper">
      <Button
        variant="outlined"
        className="cancel-button"
        onClick={onCancel}
        sx={{ textTransform: "none" }}
      >
        {secondaryButtonLabel}
      </Button>
      <div className="submit-button-style">
        <Button
          variant="contained"
          className="submit-button"
          onClick={onSubmit}
          form={formId}
          sx={{ textTransform: "none" }}
        >
          {primarybuttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default BottomFormController;

import "./styles.css";
import { Button } from "@mui/material";

interface BottomControllerProps {
  primarybuttonLabel: string;
  onSubmit: (data: any) => void;
  primaryButtonType: string;
  formId: string;
  onCancel: () => void;
  secondaryButtonLabel: string;
}
const BottomFormController = (props: BottomControllerProps) => {
  const {
    primarybuttonLabel,
    onSubmit,
    primaryButtonType = "submit",
    formId,
    onCancel,
    secondaryButtonLabel,
  } = props;
  return (
    <div className="bottom-wrapper">
      <Button
        variant="outlined"
        id="cancel-button"
        onClick={onCancel}
        sx={{ textTransform: "none" }}
      >
        {secondaryButtonLabel}
      </Button>
      <div className="submit-buttom-style">
        <Button
          variant="contained"
          id="submit-button"
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

import { Chip, Switch } from "@mui/material";
import "./styles.css";

interface ToggleProps {
  toggleCheck: string;
}

const Toggle: React.FC<ToggleProps> = ({ toggleCheck }) => {
  return (
    <div className="toggle">
      {toggleCheck === "enabled" && (
        <div className="switch">
          <Switch defaultChecked sx={{ color: "#01579B !important" }} />
          <div className="switch-text">Enabled</div>
        </div>
      )}
      {toggleCheck === "disabled" && (
        <div className="switch">
          <Switch />
          <div className="switch-text">Disabled</div>
        </div>
      )}
      {toggleCheck === "pending" && (
        <Chip label="Invite Sent" className="pending" />
      )}
    </div>
  );
};

export default Toggle;

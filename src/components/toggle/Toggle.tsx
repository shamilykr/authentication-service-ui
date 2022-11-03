import { Switch } from "@mui/material";
import "./styles.css";

interface ToggleProps {
  defaultChecked: boolean;
  text: string;
}

const Toggle: React.FC<ToggleProps> = ({ defaultChecked, text }) => {
  return (
    <div className="toggle">
      <div className="switch">
        <Switch defaultChecked={defaultChecked} />
        <div id={defaultChecked === true ? "enabled-text" : "disabled-text"}>
          {text}
        </div>
      </div>
    </div>
  );
};

export default Toggle;

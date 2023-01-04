import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";

import "./styles.css";
import { UserDetails } from "utils/user";
import { useCustomMutation } from "hooks/useMutation";
import { LOGOUT } from "services/mutations/authMutations";


interface SettingsProps {
  fullName: string;
  initials: { sx: { bgcolor: string }; children: string };
  email: string;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  onLogoutCompleted: () => void;
}

const Settings: FC<SettingsProps> = ({
  fullName,
  initials,
  anchorEl,
  email,
  handleClose,
  onLogoutCompleted,
}) => {
  const [logout] = useCustomMutation(LOGOUT, onLogoutCompleted);
  const isDesktopScreen = useMediaQuery({ query: "{max-width: 1180px, max-height: 820px}" });

  const onLogout = () => {
    logout();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={true}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: "109px",
            left: "-5px",
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem>
        <Avatar className="user-avatar-tablet" {...initials} />
        <UserDetails desktopScreen={true}>
          <div className="fullname">{fullName}</div>
          <div className="email">{email}</div>
        </UserDetails>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onLogout}>
        <ListItemIcon>
          <Logout sx={{ fontSize: "24px" }} />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};
export default Settings;

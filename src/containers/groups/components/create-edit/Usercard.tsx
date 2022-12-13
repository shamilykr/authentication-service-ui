import { FC } from "react";
import { Avatar, Box, Card, Chip, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import { stringAvatar } from "utils/table";
import "./styles.css";
import { User } from "types/user";
import { getFullName } from "utils/user";

interface UserCardProps {
  user: User;
  onRemoveUser: ({ userId }: { userId: string }) => void;
}

const UserCard: FC<UserCardProps> = ({ user, onRemoveUser }) => {
  const fullName = getFullName(user.firstName, user.lastName);
  return (
    <Box sx={{ width: "85%" }}>
      <Card variant="outlined" className="user-card">
        <div className="card-content">
          <Avatar
            {...stringAvatar(fullName?.toUpperCase())}
            className="avatar"
          />
          <div style={{ textTransform: "capitalize" }}>
            {getFullName(user.firstName, user.lastName, user.middleName)}
          </div>
          <Chip
            label={user.status}
            id={
              user?.status === "ACTIVE"
                ? "active-user"
                : user?.status === "INACTIVE"
                ? "inactive-user"
                : "invited-user"
            }
          />
        </div>
        <IconButton onClick={() => onRemoveUser({ userId: user.id })}>
          <CancelIcon
            sx={{
              fill: "#d9d9d9",
              height: 40,
              width: 40,
            }}
          />
        </IconButton>
      </Card>
    </Box>
  );
};

export default UserCard;

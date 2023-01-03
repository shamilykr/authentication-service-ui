import { FC } from "react";
import { Avatar } from "@mui/material";

import { stringSmallAvatar } from "utils/table";
import "./styles.css";
interface AvatarProps {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const CustomAvatar: FC<AvatarProps> = ({
  firstName,
  lastName,
  email,
}) => {
  return (
    <div className="custom-avatar">
      <Avatar
        {...stringSmallAvatar(`${firstName} ${lastName}`?.toUpperCase())}
        className="custom-avatar"
      />
      <div>
        <div className="custom-fullname">{`${firstName} ${lastName}`}</div>
        <div className="custom-email">{email}</div>
      </div>
    </div>
  );
};

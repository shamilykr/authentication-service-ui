import { FC } from "react";
import { Avatar } from "@mui/material";

import "./styles.css";

import { stringSmallAvatar } from "../../utils/table";

interface AvatarProps {
  firstName: string;
  lastName: string;
  email: string;
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
        className="avatar"
      />
      <div>
        <div className="fullname">{`${firstName} ${lastName}`}</div>
        <div className="email">{email}</div>
      </div>
    </div>
  );
};
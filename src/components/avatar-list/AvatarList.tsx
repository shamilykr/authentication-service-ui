import { Avatar } from "@mui/material";
import { AvatarGroup } from "@mui/material";
import { useMediaQuery } from "react-responsive";

import { stringAvatar } from "utils/table";
import "./styles.css";

const AvatarList = (avatarList: any) => {
  const { row } = avatarList;
  const isPortrait = useMediaQuery({ orientation: "portrait" });
  let DEFAULT_SIZE = 9;
  if (isPortrait) DEFAULT_SIZE = 3;

  return (
    <div className="avatar-list">
      <AvatarGroup max={DEFAULT_SIZE} spacing={22}>
        {row?.users?.map((item: any, index: number) => (
          <Avatar
            {...stringAvatar(
              `${item.firstName} ${item.lastName}`?.toUpperCase()
            )}
            className="avatar"
            key={`${item?.id}_${index}`}
          />
        ))}
      </AvatarGroup>
    </div>
  );
};

export default AvatarList;

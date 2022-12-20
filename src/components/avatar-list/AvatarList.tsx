import { Avatar } from "@mui/material";
import { AvatarGroup } from "@mui/material";

import { stringAvatar } from "utils/table";

const DEFAULT_SIZE = 9;

const AvatarList = (avatarList: any) => {
  const { row } = avatarList;
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

import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import { Chip } from "@mui/material";

import { ReactComponent as RefreshIcon } from "assets/invite-chip-icons/refresh.svg";
import { ReactComponent as ContentCopyIcon } from "assets/invite-chip-icons/copy.svg";
import { REFRESH_INVITE_TOKEN } from "containers/auth/services/mutations";
import { useCustomMutation } from "hooks/useMutation";
import { GET_USERS } from "containers/users/services/queries";

export const StatusChip: React.FC = (props: any) => {
  const { row } = props;

  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isLinkRefreshed, setIsLinkRefreshed] = useState(false);

  const [refreshInviteToken, { data }] = useCustomMutation(
    REFRESH_INVITE_TOKEN,
    undefined,
    [{ query: GET_USERS }]
  );

  const onCopyInviteLink = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const inviteLink = `${process.env.REACT_APP_BASE_URL}/#/confirmpassword?token=${props.row.inviteToken}`;
    navigator.clipboard.writeText(inviteLink);
    setIsLinkCopied(true);
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  const onRefreshInviteLink = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    refreshInviteToken({
      variables: { id: props.row.id },
    });
    setIsLinkRefreshed(true);
    setTimeout(() => {
      setIsLinkRefreshed(false);
    }, 2000);
  };

  const getClassName = () => {
    if (row.status === "ACTIVE") return "active-user";
    else if (row.status === "INACTIVE") return "inactive-user";
    else return "pending";
  };

  return (
    <div className="invited-switch">
      <Chip
        label={row.status.charAt(0) + row.status.toLowerCase().slice(1)}
        className={getClassName()}
        sx={{
          height: "31px",
          width: "76px",
          borderRadius: "5px",
          fontWeight: "600",
        }}
      />
      {row.status === "INVITED" && (
        <>
          <Tooltip
            title={
              isLinkRefreshed ? "Invite Link Refreshed!" : "Refresh Invite Link"
            }
            onClick={onRefreshInviteLink}
            sx={{ cursor: "pointer" }}
          >
            <RefreshIcon className="refresh-token-icon" />
          </Tooltip>
          <Tooltip
            title={isLinkCopied ? "Copied" : "Copy Invite Link"}
            onClick={onCopyInviteLink}
            sx={{ cursor: "pointer" }}
          >
            <ContentCopyIcon fontSize="small" className="refresh-token-icon" />
          </Tooltip>
        </>
      )}
    </div>
  );
};

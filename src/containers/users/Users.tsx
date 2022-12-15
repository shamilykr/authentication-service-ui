import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Avatar, Chip } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { ReactComponent as RefreshIcon } from "assets/refresh.svg";
import { ReactComponent as ContentCopyIcon } from "assets/copy.svg";
import CircularProgress from "@mui/material/CircularProgress";

import { GET_USERS } from "./services/queries";
import { REFRESH_INVITE_TOKEN } from "../auth/services/mutations";
import "./styles.css";
import { DELETE_USER } from "./services/mutations";
import { userListAtom } from "states/userStates";
import TableList from "components/table/Table";
import TableChipElement from "components/table-chip-element";
import { stringAvatar } from "utils/table";
import "./components/create-edit-user/styles.css";
import { allUsersAtom } from "states/userStates";
import {
  IsViewUsersVerifiedAtom,
  UserPermissionsAtom,
} from "states/permissionsStates";
import {
  CREATE_USER_PERMISSION,
  DELETE_USER_PERMISSION,
  UPDATE_USER_PERMISSION,
} from "constants/permissions";
import { useCustomMutation } from "hooks/useMutation";
import DisplayMessage from "components/display-message";
import { useLazyQuery } from "@apollo/client";

const Users: React.FC = () => {
  const [isAddVerified, setAddVerified] = React.useState(false);
  const [isViewUsersVerified] = useRecoilState(IsViewUsersVerifiedAtom);
  const [userPermissions] = useRecoilState(UserPermissionsAtom);
  const [userList, setUserList] = useRecoilState(userListAtom);
  const navigate = useNavigate();
  const setUsers = useSetRecoilState(allUsersAtom);
  const onComplete = (data: any) => {
    setUserList(data?.getUsers);
    setUsers(data?.getUsers);
  };

  const [getUsers, { loading }] = useLazyQuery(GET_USERS, {
    onCompleted: (data) => {
      onComplete(data);
    },
  });

  useEffect(() => {
    if (isViewUsersVerified) {
      getUsers();
    }
  }, [isViewUsersVerified, getUsers]);

  const onEdit = (id: any) => {
    navigate(`/home/users/add/${id}`);
  };

  const onAdd = () => {
    navigate(`/home/users/add`);
  };

  useEffect(() => {
    if (userPermissions)
      userPermissions.forEach((item: any) => {
        if (item?.name.includes(CREATE_USER_PERMISSION)) {
          setAddVerified(true);
        }
      });
  }, [userPermissions]);

  const setItemList = (data: any) => {
    setUserList(data.getUsers);
  };

  const columns: GridColumns = [
    {
      field: "firstName",
      headerName: "User",
      width: 320,
      headerClassName: "user-list-header",
      headerAlign: "left",
      renderCell: (params) => (
        <div className="username-column">
          <GetFullName {...params} />
        </div>
      ),
      sortable: false,
    },
    {
      field: "groups",
      headerName: "Groups",
      headerClassName: "user-list-header",
      flex: 0.5,
      renderCell: (params) => (
        <div className="group-list">
          <TableChipElement
            rowItems={params}
            columnName="groups"
            defaultSize={3}
          />
        </div>
      ),
      headerAlign: "left",
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "status-header",
      flex: 0.21,
      renderCell: (params) => (
        <div className="access-column">
          <CheckAccess {...params} />
        </div>
      ),
      headerAlign: "left",
      sortable: false,
    },
  ];

  const onUserClick = (params: any) => {
    navigate(`./${params.id}`);
  };
  if (!isViewUsersVerified)
    return (
      <div className="table-component">
        <DisplayMessage
          altMessage="Access Denied"
          image="./assets/access-denied.png"
          heading="Access Denied"
          description="Sorry, you are not allowed to view this page."
        />
      </div>
    );
  return (
    <>
      {!loading ? (
        <TableList
          rows={userList}
          columns={columns}
          text="All Users"
          count={userList.length}
          setItemList={setItemList}
          onAdd={onAdd}
          onEdit={onEdit}
          entity="User"
          buttonLabel="Add User"
          searchLabel="Search by First Name or Email"
          deleteMutation={DELETE_USER}
          refetchQuery={GET_USERS}
          handleRowClick={onUserClick}
          editPermission={UPDATE_USER_PERMISSION}
          deletePermission={DELETE_USER_PERMISSION}
          isViewVerified={isViewUsersVerified}
          isAddVerified={!isAddVerified}
          actionFlex={0.23}
          cursorType="pointer"
          field="firstName"
        />
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

const GetFullName = (props: any) => {
  const { row } = props;
  return (
    <>
      <Avatar
        {...stringAvatar(`${row.firstName} ${row.lastName}`?.toUpperCase())}
        className={row.status !== "INVITED" ? "avatar" : "blurred-avatar"}
      />
      <div>
        <div
          className={row.status !== "INVITED" ? "fullname" : "blurred-fullname"}
        >{`${row.firstName} ${row.lastName}`}</div>
        <div className={row.status !== "INVITED" ? "email" : "blurred-email"}>
          {row.email}
        </div>
      </div>
    </>
  );
};

const CheckAccess = (props: any) => {
  const { row } = props;

  const [isLinkCopied, setIsLinkCopied] = React.useState(false);
  const [isLinkRefreshed, setIsLinkRefreshed] = React.useState(false);

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

export default Users;

import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { Avatar, Chip } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tooltip } from "@mui/material";

import { GET_USERS } from "./services/queries";
import { REFRESH_INVITE_TOKEN } from "../auth/services/mutations";
import "./styles.css";
import { DELETE_USER } from "./services/mutations";
import { userListAtom } from "../../states/userStates";
import TableList from "../../components/table/Table";
import TableChipElement from "../../components/table-chip-element";
import { stringAvatar } from "../../utils/table";
import "./components/create-edit-user/styles.css";
import { UserPermissionsAtom } from "../../states/permissionsStates";
import { apiRequestAtom, toastMessageAtom } from "../../states/apiRequestState";

const Users: React.FC = () => {
  const [isAddVerified, setAddVerified] = React.useState(false);
  const [userPermissions] = useRecoilState(UserPermissionsAtom);
  const [userList, setUserList] = useRecoilState(userListAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const navigate = useNavigate();

  useQuery(GET_USERS, {
    onCompleted: (data) => {
      setUserList(data?.getUsers);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "network-only",
  });

  const onEdit = (id: any) => {
    navigate(`/home/users/add/${id}`);
  };

  const onAdd = () => {
    navigate(`/home/users/add`);
  };

  useEffect(() => {
    // eslint-disable-next-line
    userPermissions.map((item: any) => {
      if (item?.name.includes("create-user")) {
        setAddVerified(true);
      }
    }); // eslint-disable-next-line
  }, []);

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
            defaultSize={6}
          />
        </div>
      ),
      headerAlign: "left",
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.21,
      renderCell: (params) => (
        <div className="access-column">
          <CheckAccess {...params} />
        </div>
      ),
      headerAlign: "center",
      sortable: false,
    },
  ];

  const onUserClick = (params: any) => {
    navigate(`./${params.id}`);
  };

  return (
    <>
      <TableList
        rows={userList}
        columns={columns}
        text="All Users"
        setItemList={setItemList}
        onAdd={onAdd}
        onEdit={onEdit}
        entity="User"
        buttonLabel="Add User"
        searchLabel="Search User"
        deleteMutation={DELETE_USER}
        refetchQuery={GET_USERS}
        handleRowClick={onUserClick}
        editPermission="edit-user"
        deletePermission="delete-user"
        isAddVerified={!isAddVerified}
        actionFlex={0.23}
        cursorType="pointer"
      />
    </>
  );
};

const GetFullName = (props: any) => {
  const { row } = props;
  return (
    <>
      <Avatar
        {...stringAvatar(`${row.firstName} ${row.lastName}`?.toUpperCase())}
        className="avatar"
      />
      <div>
        <div className="fullname">{`${row.firstName} ${row.lastName}`}</div>
        <div className="email">{row.email}</div>
      </div>
    </>
  );
};

const CheckAccess = (props: any) => {
  const { row } = props;

  const [isLinkCopied, setIsLinkCopied] = React.useState(false);
  const [isLinkRefreshed, setIsLinkRefreshed] = React.useState(false);

  const [refreshInviteToken, { data }] = useMutation(REFRESH_INVITE_TOKEN, {
    refetchQueries: [{ query: GET_USERS }],
  });

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

  return (
    <div className="toggle">
      {row.status !== "INVITED" && (
        <div className="switch">
          <Chip
            icon={
              <CircleIcon
                sx={{ width: "9px", marginLeft: "18px !important" }}
                id={
                  row.status === "ACTIVE" ? "active-circle" : "inactive-circle"
                }
              />
            }
            sx={{
              marginLeft: "24px !important",
              borderRadius: "5px !important",
              width: "21px",
              height: "21px",
            }}
            id={row.status === "ACTIVE" ? "active" : "inactive"}
          />
          {row.status === "ACTIVE" ? (
            <div id="enabled-text">Active</div>
          ) : (
            <div id="enabled-text">Inactive</div>
          )}
        </div>
      )}
      <div className="invited-switch">
        {row.status === "INVITED" && (
          <>
            <Chip
              label="Invited"
              className="pending"
              sx={{
                height: "36px",
                width: "107px",
                borderRadius: "5px",
                fontWeight: "600",
              }}
            />
            <Tooltip
              title={isLinkCopied ? "Copied" : "Copy Invite Link"}
              onClick={onCopyInviteLink}
              sx={{ cursor: "pointer" }}
            >
              <ContentCopyIcon fontSize="small" htmlColor="#01579B" />
            </Tooltip>
            <Tooltip
              title={
                isLinkRefreshed
                  ? "Invite Link Refreshed!"
                  : "Refresh Invite Link"
              }
              onClick={onRefreshInviteLink}
              sx={{ cursor: "pointer" }}
            >
              <RefreshIcon fontSize="medium" htmlColor="#01579B" />
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;

import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { GridColumns, GridRowId } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import "./styles.css";
import { DELETE_GROUP } from "../../services/mutations";
import { GET_GROUPS } from "../../services/queries";
import TableList from "components/table";
import { groupListAtom } from "states/groupStates";
import TableChipElement from "components/table-chip-element";
import {
  IsViewGroupsVerifiedAtom,
  UserPermissionsAtom,
} from "states/permissionsStates";
import AvatarList from "components/avatar-list/AvatarList";
import {
  CREATE_GROUP_PERMISSION,
  DELETE_GROUP_PERMISSION,
  UPDATE_GROUP_PERMISSION,
} from "constants/permissions";
import { useCustomQuery } from "hooks/useQuery";
import DisplayMessage from "components/display-message";

const GroupList: React.FC = () => {
  const navigate = useNavigate();

  const [isAddVerified, setAddVerified] = React.useState(false);
  const [isViewGroupsVerified] = useRecoilState(IsViewGroupsVerifiedAtom);
  const [userPermissions] = useRecoilState(UserPermissionsAtom);
  const [groupList, setGroupList] = useRecoilState(groupListAtom);

  const onGetGroupsComplete = (data: any) => {
    setGroupList(data?.getGroups);
  };

  const { loading } = useCustomQuery(
    GET_GROUPS,
    onGetGroupsComplete,
    null,
    !isViewGroupsVerified
  );

  const columns: GridColumns = [
    {
      field: "name",
      headerName: "Group",
      headerClassName: "user-list-header",
      headerAlign: "left",
      width: 280,
      sortable: false,
    },
    {
      field: "roles",
      headerName: "Roles",
      headerClassName: "user-list-header",
      flex: 0.6,
      renderCell: (params) => (
        <div className="role-list">
          <TableChipElement
            rowItems={params}
            columnName="roles"
            defaultSize={3}
          />
        </div>
      ),
      headerAlign: "left",
      sortable: false,
    },
    {
      field: "users",
      headerName: "Members",
      headerClassName: "user-list-header",
      flex: 0.5,
      renderCell: (params) => (
        <div className="role-list">
          <AvatarList {...params} />
        </div>
      ),
      headerAlign: "left",
      sortable: false,
    },
  ];

  const onAddGroup = () => {
    navigate("add");
  };

  const onEditGroup = (id: GridRowId) => {
    navigate(`edit/${id}`);
  };

  useEffect(() => {
    userPermissions.forEach((item: any) => {
      if (item?.name.includes(CREATE_GROUP_PERMISSION)) {
        setAddVerified(true);
      }
    });
  }, [userPermissions]);

  const setItemList = (data: any) => {
    setGroupList(data.getGroups);
  };
  if (!isViewGroupsVerified && !loading)
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
          rows={groupList}
          columns={columns}
          text="All Groups"
          count={groupList.length}
          buttonLabel="Add Group"
          searchLabel="Search Group"
          setItemList={setItemList}
          entity="Group"
          deleteMutation={DELETE_GROUP}
          refetchQuery={GET_GROUPS}
          onAdd={onAddGroup}
          onEdit={onEditGroup}
          editPermission={UPDATE_GROUP_PERMISSION}
          deletePermission={DELETE_GROUP_PERMISSION}
          isViewVerified={isViewGroupsVerified}
          isAddVerified={!isAddVerified}
          actionFlex={0.3}
          cursorType="default"
          field="name"
        />
      ) : (
        <CircularProgress />
      )}
    </>
  );
};
export default GroupList;

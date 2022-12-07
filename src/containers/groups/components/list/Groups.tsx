import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ApolloError, useQuery } from "@apollo/client";
import { GridColumns, GridRowId, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import { DELETE_GROUP } from "../../services/mutations";
import { GET_GROUPS } from "../../services/queries";
import TableList from "../../../../components/table";
import { groupListAtom } from "../../../../states/groupStates";
import TableChipElement from "../../../../components/table-chip-element";
import { IsViewGroupsVerifiedAtom, UserPermissionsAtom } from "../../../../states/permissionsStates";
import AvatarList from "../../../../components/avatar-list/AvatarList";
import {
  apiRequestAtom,
  toastMessageAtom,
} from "../../../../states/apiRequestState";
import {
  CREATE_GROUP_PERMISSION,
  DELETE_GROUP_PERMISSION,
  UPDATE_GROUP_PERMISSION,
} from "../../../../constants/permissions";

const GroupList: React.FC = () => {
  const navigate = useNavigate();

  const [isAddVerified, setAddVerified] = React.useState(false);
  const [isViewGroupsVerified] = useRecoilState(IsViewGroupsVerifiedAtom);
  const [userPermissions] = useRecoilState(UserPermissionsAtom);
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const [groupList, setGroupList] = useRecoilState(groupListAtom);

  useQuery(GET_GROUPS, {
    onCompleted: (data) => {
      setGroupList(data?.getGroups);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "network-only",
  });

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

  const onGroupClick = (params: GridRowParams) => {
    navigate(`./${params.id}`);
  };

  const onAddGroup = () => {
    navigate("add");
  };

  const onEditGroup = (id: GridRowId) => {
    navigate(`edit/${id}`);
  };

  useEffect(() => {
    // eslint-disable-next-line
    userPermissions.map((item: any) => {
      if (item?.name.includes(CREATE_GROUP_PERMISSION)) {
        setAddVerified(true);
      }
    }); // eslint-disable-next-line
  }, []);

  const setItemList = (data: any) => {
    setGroupList(data.getGroups);
  };

  return (
    <>
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
        handleRowClick={onGroupClick}
        editPermission={UPDATE_GROUP_PERMISSION}
        deletePermission={DELETE_GROUP_PERMISSION}
        isViewVerified={isViewGroupsVerified}
        isAddVerified={!isAddVerified}
        actionFlex={0.3}
        cursorType="pointer"
      />
    </>
  );
};
export default GroupList;

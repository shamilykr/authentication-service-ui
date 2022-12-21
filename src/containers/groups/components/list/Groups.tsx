import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { GridRowId } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import "./styles.css";
import { DELETE_GROUP } from "../../services/mutations";
import { GET_GROUPS } from "../../services/queries";
import TableList from "components/table";
import { groupListAtom } from "states/groupStates";
import {
  IsViewGroupsVerifiedAtom,
  UserPermissionsAtom,
} from "states/permissionsStates";
import {
  CREATE_GROUP_PERMISSION,
  DELETE_GROUP_PERMISSION,
  UPDATE_GROUP_PERMISSION,
} from "constants/permissions";
import DisplayMessage from "components/display-message";
import { AddEntity, SearchEntity } from "types/generic";
import {
  ACCESS_DENIED_DESCRIPTION,
  ACCESS_DENIED_MESSAGE,
} from "constants/messages";
import { columns } from "utils/groups";
import { useCustomLazyQuery } from "hooks/useLazyQuery";

const GroupList: React.FC = () => {
  const navigate = useNavigate();

  const [isAddVerified, setAddVerified] = useState(false);
  const [groupCount, setGroupCount] = useState(0);
  const [isViewGroupsVerified] = useRecoilState(IsViewGroupsVerifiedAtom);
  const [userPermissions] = useRecoilState(UserPermissionsAtom);
  const [groupList, setGroupList] = useRecoilState(groupListAtom);

  const onGetGroupsComplete = (data: any) => {
    setGroupList(data?.getGroups?.results);
    setGroupCount(data?.getGroups?.totalCount);
  };

  const { lazyQuery: getGroups, loading } = useCustomLazyQuery(
    GET_GROUPS,
    onGetGroupsComplete
  );

  useEffect(() => {
    if (isViewGroupsVerified && groupCount === 0) {
      getGroups();
    }
  }, [isViewGroupsVerified, getGroups, groupCount]);

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
    setGroupList(data?.getGroups?.results);
    setGroupCount(data?.getGroups?.totalCount);
  };
  if (!isViewGroupsVerified && !loading)
    return (
      <div className="denied-table-component">
        <DisplayMessage
          altMessage={ACCESS_DENIED_MESSAGE}
          image="./assets/access-denied.png"
          heading={ACCESS_DENIED_MESSAGE}
          description={ACCESS_DENIED_DESCRIPTION}
        />
      </div>
    );
  return (
    <>
      {!loading ? (
        <TableList
          rows={groupList}
          columns={columns}
          count={groupCount}
          buttonLabel={AddEntity.ADD_GROUP}
          searchLabel={SearchEntity.SEARCH_GROUP}
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

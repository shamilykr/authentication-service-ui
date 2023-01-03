import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import { GET_USERS } from "services/queries/userQueries";
import { DELETE_USER } from "services/mutations/userMutations";
import TableList from "components/table/Table";
import DisplayMessage from "components/display-message";
import { columns } from "utils/user";
import { userListAtom } from "states/userStates";
import { groupListAtom } from "states/groupStates";
import {
  IsViewGroupsVerifiedAtom,
  IsViewUsersVerifiedAtom,
  UserPermissionsAtom,
} from "states/permissionsStates";
import {
  groupFilterAtom,
  statusFilterAtom,
} from "states/searchSortFilterStates";
import {
  CREATE_USER_PERMISSION,
  DELETE_USER_PERMISSION,
  UPDATE_USER_PERMISSION,
} from "constants/permissions";
import { AddEntity, SearchEntity } from "types/generic";
import {
  ACCESS_DENIED_DESCRIPTION,
  ACCESS_DENIED_MESSAGE,
} from "constants/messages";
import { useCustomLazyQuery } from "hooks/useLazyQuery";
import "../create-edit/styles.css";
import "./styles.css";
import { RoutePaths } from "constants/routes";

const Users: React.FC = () => {
  const [isAddVerified, setAddVerified] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [isViewUsersVerified] = useRecoilState(IsViewUsersVerifiedAtom);
  const [isViewGroupsVerified] = useRecoilState(IsViewGroupsVerifiedAtom);
  const [userPermissions] = useRecoilState(UserPermissionsAtom);
  const [userList, setUserList] = useRecoilState(userListAtom);
  const [checkedStatus, setCheckedStatus] = useRecoilState(statusFilterAtom);
  const [checkedGroups, setCheckedGroups] = useRecoilState(groupFilterAtom);
  const [groupList] = useRecoilState(groupListAtom);
  const navigate = useNavigate();

  const onComplete = (data: any) => {
    setUserList(data?.getUsers?.results);
    setUsersCount(data?.getUsers?.totalCount);
  };

  const { lazyQuery: getUsers, loading } = useCustomLazyQuery(
    GET_USERS,
    onComplete
  );

  useEffect(() => {
    if (isViewUsersVerified) {
      getUsers({ variables: { pagination: { limit: 8, offset: 0 } } });
    }
  }, [isViewUsersVerified, getUsers]);

  const onEdit = (id: any) => {
    navigate(`${RoutePaths.usersUrl}/add/${id}`);
  };

  const onAdd = () => {
    navigate(`${RoutePaths.usersUrl}/add`);
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
    setUserList(data?.getUsers?.results);
    setUsersCount(data?.getUsers?.totalCount);
  };

  const onUserClick = (params: any) => {
    navigate(`./${params.id}`);
  };

  if (!isViewUsersVerified && !loading)
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
          rows={userList}
          columns={columns}
          count={usersCount}
          setItemList={setItemList}
          onAdd={onAdd}
          onEdit={onEdit}
          buttonLabel={AddEntity.ADD_USER}
          searchLabel={SearchEntity.SEARCH_USER}
          deleteMutation={DELETE_USER}
          refetchQuery={GET_USERS}
          handleRowClick={onUserClick}
          editPermission={UPDATE_USER_PERMISSION}
          deletePermission={DELETE_USER_PERMISSION}
          isViewVerified={isViewUsersVerified}
          isAddVerified={!isAddVerified}
          field="firstName"
          filterList={groupList}
          firstFilter={checkedStatus}
          setFirstFilter={setCheckedStatus}
          secondFilter={checkedGroups}
          setSecondFilter={setCheckedGroups}
          filterName={["Status", "Groups"]}
          isViewFilterVerified={isViewGroupsVerified}
        />
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Users;

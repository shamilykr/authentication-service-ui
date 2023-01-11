import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { GridRowId } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import "./styles.css";
import { GET_ROLES } from "services/queries/roleQueries";
import { DELETE_ROLE } from "services/mutations/roleMutations";
import { RolesListAtom } from "states/roleStates";
import TableList from "components/table";
import {
  IsViewRolesVerifiedAtom,
  UserPermissionsAtom,
} from "states/permissionsStates";
import {
  CREATE_ROLE_PERMISSION,
  DELETE_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION,
} from "constants/permissions";
import DisplayMessage from "components/display-message";
import { AddEntity, SearchEntity } from "types/generic";
import {
  ACCESS_DENIED_DESCRIPTION,
  ACCESS_DENIED_MESSAGE,
} from "constants/messages";
import { columns } from "utils/roles";
import { useCustomLazyQuery } from "hooks/useLazyQuery";

const Roles: React.FC = () => {
  const navigate = useNavigate();

  const [isAddVerified, setAddVerified] = React.useState(false);
  const [roleCount, setRoleCount] = useState(0);
  const [isViewRolesVerified] = useRecoilState(IsViewRolesVerifiedAtom);
  const [userPermissions] = useRecoilState(UserPermissionsAtom);

  const [roleList, setRoleList] = useRecoilState(RolesListAtom);

  const onGetRolesComplete = (data: any) => {
    setRoleList(data?.getRoles?.results);
    setRoleCount(data?.getRoles?.totalCount);
  };

  const { lazyQuery: getRoles, loading } = useCustomLazyQuery(
    GET_ROLES,
    onGetRolesComplete
  );

  useEffect(() => {
    if (isViewRolesVerified) {
      getRoles({ variables: { pagination: { limit: 15, offset: 0 } } });
    }
  }, [isViewRolesVerified, getRoles]);

  useEffect(() => {
    userPermissions.forEach((item: any) => {
      if (item?.name.includes(CREATE_ROLE_PERMISSION)) {
        setAddVerified(true);
      }
    });
  }, [userPermissions]);
  const setItemList = (data: any) => {
    setRoleList(data.getRoles?.results);
    setRoleCount(data?.getRoles?.totalCount);
  };

  const onAddRole = () => {
    navigate("add");
  };

  const onEditRole = (id: GridRowId) => {
    navigate(`edit/${id}`);
  };

  if (!isViewRolesVerified && !loading)
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
          rows={roleList}
          columns={columns}
          count={roleCount}
          buttonLabel={AddEntity.ADD_ROLE}
          searchLabel={SearchEntity.SEARCH_ROLE}
          setItemList={setItemList}
          deleteMutation={DELETE_ROLE}
          refetchQuery={GET_ROLES}
          onAdd={onAddRole}
          onEdit={onEditRole}
          editPermission={UPDATE_ROLE_PERMISSION}
          deletePermission={DELETE_ROLE_PERMISSION}
          isViewVerified={isViewRolesVerified}
          isAddVerified={!isAddVerified}
          field="name"
        />
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Roles;

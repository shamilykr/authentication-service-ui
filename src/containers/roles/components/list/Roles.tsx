import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { GridRowId } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import "./roles.css";
import { GET_ROLES } from "../../services/queries";
import { DELETE_ROLE } from "../../services/mutations";
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
import { useLazyQuery } from "@apollo/client";
import { AddEntity, SearchEntity } from "types/generic";
import {
  ACCESS_DENIED_DESCRIPTION,
  ACCESS_DENIED_MESSAGE,
} from "constants/messages";
import { columns } from "utils/roles";

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

  const [getRoles, { loading }] = useLazyQuery(GET_ROLES, {
    onCompleted: (data) => {
      onGetRolesComplete(data);
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (isViewRolesVerified && roleCount === 0) {
      getRoles();
    }
  }, [isViewRolesVerified, getRoles, roleCount]);

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
          entity="Role"
          deleteMutation={DELETE_ROLE}
          refetchQuery={GET_ROLES}
          onAdd={onAddRole}
          onEdit={onEditRole}
          editPermission={UPDATE_ROLE_PERMISSION}
          deletePermission={DELETE_ROLE_PERMISSION}
          isViewVerified={isViewRolesVerified}
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

export default Roles;

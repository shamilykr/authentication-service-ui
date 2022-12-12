import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { GridColumns, GridRowId } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import "./roles.css";
import { GET_ROLES } from "../../services/queries";
import { DELETE_ROLE } from "../../services/mutations";
import { RolesListAtom } from "../../../../states/roleStates";
import TableList from "../../../../components/table";
import {
  IsViewRolesVerifiedAtom,
  UserPermissionsAtom,
} from "../../../../states/permissionsStates";
import TableChipElement from "../../../../components/table-chip-element";
import {
  CREATE_ROLE_PERMISSION,
  DELETE_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION,
} from "../../../../constants/permissions";
import { useCustomQuery } from "../../../../hooks/useQuery";

const Roles: React.FC = () => {
  const navigate = useNavigate();

  const [isAddVerified, setAddVerified] = React.useState(false);
  const [isViewRolesVerified] = useRecoilState(IsViewRolesVerifiedAtom);
  const [userPermissions] = useRecoilState(UserPermissionsAtom);

  const [roleList, setRoleList] = useRecoilState(RolesListAtom);

  const onGetRolesComplete = (data: any) => {
    setRoleList(data?.getRoles);
  };

  const { loading } = useCustomQuery(GET_ROLES, onGetRolesComplete);

  const setItemList = (data: any) => {
    setRoleList(data.getRoles);
  };

  const columns: GridColumns = [
    {
      field: "name",
      headerName: "Role",
      width: 280,
      headerClassName: "user-list-header",
      headerAlign: "left",
      sortable: false,
    },
    {
      field: "permissions",
      headerName: "Permissions",
      headerClassName: "user-list-header",
      renderCell: (params) => (
        <div className="permission-list">
          <TableChipElement
            rowItems={params}
            columnName="permissions"
            defaultSize={3}
          />
        </div>
      ),
      headerAlign: "left",
      sortable: false,
      flex: 0.7,
    },
  ];

  const onAddRole = () => {
    navigate("add");
  };

  const onEditRole = (id: GridRowId) => {
    navigate(`edit/${id}`);
  };

  useEffect(() => {
    // eslint-disable-next-line
    userPermissions.map((item: any) => {
      if (item?.name.includes(CREATE_ROLE_PERMISSION)) {
        setAddVerified(true);
      }
    }); // eslint-disable-next-line
  }, []);

  return (
    <>
      {!loading ? (
        <TableList
          rows={roleList}
          columns={columns}
          text="All Roles"
          count={roleList.length}
          buttonLabel="Add Role"
          searchLabel="Search Role"
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
        />
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Roles;

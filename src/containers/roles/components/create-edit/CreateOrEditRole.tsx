import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import CircularProgress from "@mui/material/CircularProgress";

import { GET_ROLE } from "../../services/queries";
import {
  CREATE_ROLE,
  UPDATE_ROLE,
  UPDATE_ROLE_PERMISSIONS,
} from "../../services/mutations";
import RoleForm from "./RoleForm";
import "./styles.css";
import { Permission } from "types/user";
import PermissionCards from "components/permission-cards/PermissionCards";
import { FieldValues } from "react-hook-form";
import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";
import { Role } from "types/role";
import {
  ROLE_CREATE_SUCCESS_MESSAGE,
  ROLE_UPDATE_SUCCESS_MESSAGE,
} from "constants/messages";
import { useCustomQuery } from "hooks/useQuery";
import { useCustomMutation } from "hooks/useMutation";

const CreateOrEditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const [role, setRole] = useState<Role>();
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);

  const [createRole, { data: createdRoleData }] =
    useCustomMutation(CREATE_ROLE);
  const [updateRole, { data: updatedRoleData }] =
    useCustomMutation(UPDATE_ROLE);
  const [updateRolePermissions, { data: updatedRolePermissionsData }] =
    useCustomMutation(UPDATE_ROLE_PERMISSIONS);

  const onGetRoleComplete = (data: any) => {
    setRole(data?.getRole);
    const permissions = data?.getRole?.permissions.map(
      (permission: Permission) => permission
    );
    setRolePermissions([...permissions]);
  };

  const { loading } = useCustomQuery(
    GET_ROLE,
    onGetRoleComplete,
    { id: id },
    !id
  );

  useEffect(() => {
    if (createdRoleData)
      updateRolePermissions({
        variables: {
          id: createdRoleData?.createRole?.id,
          input: {
            permissions: rolePermissions.map((permission) => permission.id),
          },
        },
        onCompleted: () => {
          navigate("/home/roles");
          setApiSuccess(true);
          setToastMessage(ROLE_CREATE_SUCCESS_MESSAGE);
        },
      }); // eslint-disable-next-line
  }, [createdRoleData]);

  useEffect(() => {
    if (updatedRoleData && updatedRolePermissionsData) {
      navigate("/home/roles");
      setToastMessage(ROLE_UPDATE_SUCCESS_MESSAGE);
      setApiSuccess(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedRoleData, updatedRolePermissionsData]);

  const onCreateRole = (inputs: FieldValues) => {
    createRole({ variables: { input: inputs } });
  };

  const onEditRole = (inputs: FieldValues) => {
    updateRole({ variables: { id: id, input: inputs } });
    updateRolePermissions({
      variables: {
        id: id,
        input: {
          permissions: rolePermissions.map((permission) => permission.id),
        },
      },
    });
  };

  return (
    <div className="roleContainer">
      {!loading && (
        <RoleForm
          name={role?.name || ""}
          createRole={onCreateRole}
          editRole={onEditRole}
        />
      )}
      <div className="role-permissions">
        <div className="permission-header"> Permissions</div>
        {!loading ? (
          <PermissionCards
            userSelectedPermissions={rolePermissions}
            setUserSelectedPermissions={setRolePermissions}
          />
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
};

export default CreateOrEditRole;

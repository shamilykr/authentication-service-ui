import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import {
  CREATE_USER,
  UPDATE_USER_GROUPS,
  UPDATE_USER_PERMISSIONS,
} from "../../services/mutations";
import "./styles.css";
import UserForm from "./UserForm";
import { GroupPermissionsDetails } from "types/permission";
import { FieldValues } from "react-hook-form";
import { Permission } from "types/user";
import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";
import { USER_CREATE_SUCCESS_MESSAGE } from "constants/messages";
import { Group } from "types/group";
import { useCustomMutation } from "hooks/useMutation";

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const [userPermissions, setUserPermissions] = useState<
    GroupPermissionsDetails[]
  >([]);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [createUser, { error: createUserError, data }] =
    useCustomMutation(CREATE_USER);
  const [updateUserGroups, { error: groupUpdateError }] =
    useCustomMutation(UPDATE_USER_GROUPS);
  const [updateUserPermissions, { error: permissionUpdateError }] =
    useCustomMutation(UPDATE_USER_PERMISSIONS);

  useEffect(() => {
    if (data) updateUserInfo(); // eslint-disable-next-line
  }, [data]);

  const onCreateUser = (
    inputs: FieldValues,
    userGroups: Group[],
    selectedPermissions: Permission[]
  ) => {
    createUser({
      variables: {
        input: {
          ...inputs,
          phone: String(inputs.phone).replaceAll(" ", ""),
        },
      },
    });
    setUserPermissions(userPermissions);
    setUserGroups(userGroups);
    setPermissions(selectedPermissions.map((permission) => permission.id));
  };

  const updateUserInfo = () => {
    updateUserGroups({
      variables: {
        id: data?.inviteTokenSignup.user.id,
        input: {
          groups: userGroups.map((group) => group.id),
        },
      },
    });

    updateUserPermissions({
      variables: {
        id: data?.inviteTokenSignup.user.id,
        input: {
          permissions: permissions,
        },
      },

      onCompleted: () => {
        if (!createUserError && !groupUpdateError && !permissionUpdateError) {
          navigate("/home/users");
          setApiSuccess(true);
          setToastMessage(USER_CREATE_SUCCESS_MESSAGE);
        }
      },
    });
  };

  return <UserForm createUser={onCreateUser} />;
};

export default AddUser;

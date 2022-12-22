import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  UPDATE_USER,
  UPDATE_USER_GROUPS,
  UPDATE_USER_PERMISSIONS,
} from "services/mutations/userMutations";
import UserForm from "./UserForm";
import "./styles.css";
import { Permission } from "types/user";
import { FieldValues } from "react-hook-form";
import { currentUserAtom } from "states/loginStates";
import { useRecoilState, useSetRecoilState } from "recoil";
import { UserPermissionsAtom } from "states/permissionsStates";
import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";
import { USER_UPDATE_SUCCESS_MESSAGE } from "constants/messages";
import { Group } from "types/group";
import { useCustomMutation } from "hooks/useMutation";

const EditUser: React.FC = () => {
  const { id } = useParams();
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const setUserPermissions = useSetRecoilState(UserPermissionsAtom);
  const [currentUserDetails, setCurrentUserDetails] =
    useRecoilState(currentUserAtom);

  const onUpdateUserCompleted = (data: any) => {
    if (currentUserDetails.id === id) {
      setCurrentUserDetails(data.updateUser);
    }
  };
  const onUpdateUserPermissionsCompleted = (data: any) => {
    if (currentUserDetails.id === id) {
      setUserPermissions(data.updateUserPermissions);
    }
  };

  const [updateUser, { error: userUpdateError }] = useCustomMutation(
    UPDATE_USER,
    onUpdateUserCompleted
  );
  const [updateUserGroups, { error: groupUpdateError }] =
    useCustomMutation(UPDATE_USER_GROUPS);
  const [updateUserPermissions, { error: permissionUpdateError }] =
    useCustomMutation(
      UPDATE_USER_PERMISSIONS,
      onUpdateUserPermissionsCompleted
    );
  const navigate = useNavigate();

  const onUpdateUser = (
    inputs: FieldValues,
    userGroups: Group[],
    selectedPermissions: Permission[]
  ) => {
    updateUserGroups({
      variables: {
        id: id,
        input: {
          groups: userGroups.map((group) => group.id),
        },
      },
    });

    updateUserPermissions({
      variables: {
        id: id,
        input: {
          permissions: selectedPermissions.map((permission) => permission.id),
        },
      },
    });

    updateUser({
      variables: {
        id: id,
        input: {
          firstName: inputs.firstName,
          middleName: inputs.middleName,
          lastName: inputs.lastName,
        },
      },
      onCompleted: () => {
        if (!userUpdateError && !groupUpdateError && !permissionUpdateError) {
          navigate("/home/users");
          setApiSuccess(true);
          setToastMessage(USER_UPDATE_SUCCESS_MESSAGE);
        }
      },
    });
  };

  return <UserForm isEdit updateUser={onUpdateUser} />;
};

export default EditUser;

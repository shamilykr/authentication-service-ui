import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";

import {
  UPDATE_USER,
  UPDATE_USER_GROUPS,
  UPDATE_USER_PERMISSIONS,
} from "services/mutations/userMutations";
import { Permission } from "types/user";
import { currentUserAtom } from "states/loginStates";
import { UserPermissionsAtom } from "states/permissionsStates";
import { GET_CURRENT_USER } from "services/queries/authQueries";
import { useCustomLazyQuery } from "hooks/useLazyQuery";
import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";
import { USER_UPDATE_SUCCESS_MESSAGE } from "constants/messages";
import { Group } from "types/group";
import { useCustomMutation } from "hooks/useMutation";
import { RoutePaths } from "constants/routes";
import UserForm from "./UserForm";
import "./styles.css";

const EditUser: React.FC = () => {
  const { id } = useParams();
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const setUserPermissions = useSetRecoilState(UserPermissionsAtom);
  const [currentUserDetails, setCurrentUserDetails] =
    useRecoilState(currentUserAtom);

  const onGetCurrentUserCompleted = (data: any) => {
    setCurrentUserDetails(data.getCurrentUser);
    setUserPermissions(data.getCurrentUser?.permissions);
    navigate(RoutePaths.usersUrl);
  };

  const { lazyQuery: getCurrentUser } = useCustomLazyQuery(
    GET_CURRENT_USER,
    onGetCurrentUserCompleted
  );

  const [updateUser, { error: userUpdateError }] =
    useCustomMutation(UPDATE_USER);

  const [updateUserGroups, { error: groupUpdateError }] =
    useCustomMutation(UPDATE_USER_GROUPS);
  const [updateUserPermissions, { error: permissionUpdateError }] =
    useCustomMutation(UPDATE_USER_PERMISSIONS);
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
          if (currentUserDetails.id !== id) {
            navigate(RoutePaths.usersUrl);
          }
          setApiSuccess(true);
          setToastMessage(USER_UPDATE_SUCCESS_MESSAGE);
        }
        if (currentUserDetails.id === id) {
          getCurrentUser();
        }
      },
    });
  };

  return <UserForm isEdit updateUser={onUpdateUser} />;
};

export default EditUser;

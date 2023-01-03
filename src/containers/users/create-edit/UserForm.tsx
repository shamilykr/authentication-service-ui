import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Tab, Tabs } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import CircularProgress from "@mui/material/CircularProgress";

import {
  IsViewEntitiesVerifiedAtom,
  IsViewGroupsVerifiedAtom,
  UserPermissionsAtom,
} from "states/permissionsStates";
import { currentUserAtom } from "states/loginStates";
import FormInputText from "components/input-text";
import ChecklistComponent from "components/checklist";
import TabPanel from "components/tab-panel";
import PermissionCards from "components/permission-cards";
import BottomFormController from "components/bottom-form-controller";
import { GET_USER, GET_USER_PERMISSIONS } from "services/queries/userQueries";
import { GET_GROUPS } from "services/queries/groupQueries";
import { Permission, User } from "types/user";
import { Group } from "types/group";
import { AddEntity, UpdateEntity } from "types/generic";
import { AddUserformSchema, EditUserformSchema } from "utils/user";
import { renderAccessDenied } from "utils/generic";
import { useCustomQuery } from "hooks/useQuery";
import { RoutePaths } from "constants/routes";
import "./styles.css";

interface UserProps {
  isEdit?: boolean;
  updateUser?: (
    inputs: FieldValues,
    userGroups: Group[],
    userPermissions: Permission[]
  ) => void;
  createUser?: (
    inputs: FieldValues,
    userGroups: Group[],
    userPermissions: Permission[]
  ) => void;
}

const UserForm = (props: UserProps) => {
  const { isEdit, updateUser, createUser } = props;

  const userformSchema = isEdit ? EditUserformSchema : AddUserformSchema;

  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [isViewGroupsVerified] = useRecoilState(IsViewGroupsVerifiedAtom);
  const [isViewEntitiesVerified] = useRecoilState(IsViewEntitiesVerifiedAtom);
  const [currentUserDetails] = useRecoilState(currentUserAtom);
  const setCurrentUserPermissions = useSetRecoilState(UserPermissionsAtom);
  const [userSelectedPermissions, setUserSelectedPermissions] = useState<
    Permission[]
  >([]);

  const onGetGroupsComplete = (data: any) => {
    const groups = data?.getGroups?.results?.map((group: Group) => group);
    setAllGroups([...groups]);
  };

  const { data: groupData, loading: groupsLoading } = useCustomQuery(
    GET_GROUPS,
    onGetGroupsComplete,
    null,
    !isViewGroupsVerified
  );

  const onGetUserComplete = (data: any) => {
    setUser(data?.getUser);
    setUserGroups(data?.getUser.groups);
  };
  const { loading } = useCustomQuery(
    GET_USER,
    onGetUserComplete,
    { id: id },
    !id
  );

  const onGetUserPermissionsComplete = (data: any) => {
    setUserSelectedPermissions(data?.getUserPermissions);
  };

  useCustomQuery(
    GET_USER_PERMISSIONS,
    onGetUserPermissionsComplete,
    { id: id },
    !id
  );

  const methods = useForm({
    resolver: yupResolver(userformSchema),
  });

  const { handleSubmit } = methods;

  const onSubmitForm = (inputs: FieldValues) => {
    if (updateUser) {
      updateUser(inputs, userGroups, userSelectedPermissions);
      if (user?.id === currentUserDetails.id) {
        setCurrentUserPermissions(userSelectedPermissions);
      }
    } else if (createUser)
      createUser(inputs, userGroups, userSelectedPermissions);
  };

  const removeGroup = (group: Group) => {
    setUserGroups(
      userGroups.filter((groupDetails) => groupDetails.id !== group.id)
    );
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    group?: Group
  ) => {
    const value = event.target.value;
    if (event.target.checked) {
      if (value === "all") {
        setUserGroups(allGroups);
      } else {
        if (group) {
          setUserGroups([...userGroups, group]);
        }
      }
    } else {
      if (value === "all") {
        setUserGroups([]);
      }
      if (group) removeGroup(group);
    }
  };

  const onBackNavigation = () => {
    navigate(RoutePaths.usersUrl);
  };

  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div id="page">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)} id="add-user-form">
            <div id="inputs">
              {!loading && (
                <div id="form-row">
                  <FormInputText
                    name="firstName"
                    label="First Name*"
                    type="text"
                    className="fields three-items-row"
                    defaultText={user?.firstName}
                  />
                  <FormInputText
                    name="lastName"
                    label="Last Name*"
                    type="type"
                    className="fields three-items-row"
                    defaultText={user?.lastName}
                  />
                </div>
              )}
              {!isEdit && (
                <div id="form-row">
                  <FormInputText
                    name="email"
                    label="Email*"
                    type="text"
                    className="fields three-items-row"
                  />
                  <FormInputText
                    name="phone"
                    label="Phone Number*"
                    type="text"
                    className="fields three-items-row"
                  />
                </div>
              )}
            </div>
          </form>
        </FormProvider>
        <div>
          <Box sx={{ height: "100%" }}>
            <Box sx={{ display: "flex" }}>
              <Tabs
                value={value}
                onChange={handleTabChange}
                className="custom-tabs"
              >
                <Tab label="Groups" />
                <Tab label="Permissions" />
              </Tabs>
            </Box>
            {!groupsLoading ? (
              <TabPanel value={value} index={0}>
                <div id="groups-permissions">
                  <div className="checklist-container">
                    {isViewGroupsVerified ? (
                      <ChecklistComponent
                        mapList={groupData?.getGroups?.results}
                        currentCheckedItems={userGroups}
                        onChange={handleChange}
                      />
                    ) : (
                      <>{renderAccessDenied()}</>
                    )}
                  </div>
                </div>
              </TabPanel>
            ) : (
              <CircularProgress sx={{ top: "208% !important" }} />
            )}
            <TabPanel value={value} index={1}>
              {isViewEntitiesVerified ? (
                <PermissionCards
                  userSelectedPermissions={userSelectedPermissions}
                  setUserSelectedPermissions={setUserSelectedPermissions}
                  groups={userGroups}
                />
              ) : (
                <>{renderAccessDenied()}</>
              )}
            </TabPanel>
          </Box>
        </div>
      </div>
      <BottomFormController
        primarybuttonLabel={
          isEdit ? UpdateEntity.UPDATE_USER : AddEntity.CREATE_USER
        }
        formId="add-user-form"
        onSubmit={() => handleSubmit(onSubmitForm)()}
        onCancel={onBackNavigation}
        secondaryButtonLabel="Cancel"
      />
    </>
  );
};

export default UserForm;

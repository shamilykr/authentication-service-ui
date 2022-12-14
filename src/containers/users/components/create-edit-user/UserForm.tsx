import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";

import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import CircularProgress from "@mui/material/CircularProgress";
import { IsViewGroupsVerifiedAtom } from "states/permissionsStates";
import { GET_GROUPS } from "../../../groups/services/queries";
import FormInputText from "components/inputText";
import { ChecklistComponent } from "components/checklist/CheckList";
import { GET_USER, GET_USER_PERMISSIONS } from "../../services/queries";
import { Permission, User } from "types/user";
import "./styles.css";
import { AddUserformSchema, EditUserformSchema } from "../../userSchema";
import PermissionCards from "components/permission-cards/PermissionCards";
import BottomFormController from "components/bottom-form-controller";
import { useCustomQuery } from "hooks/useQuery";
import { Group } from "types/group";
import DisplayMessage from "components/display-message";

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
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

  const [userSelectedPermissions, setUserSelectedPermissions] = useState<
    Permission[]
  >([]);

  const onGetGroupsComplete = (data: any) => {
    const groups = data?.getGroups.map((group: Group) => group);
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
    if (updateUser) updateUser(inputs, userGroups, userSelectedPermissions);
    else if (createUser)
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
    navigate("/home/users");
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
                        mapList={groupData?.getGroups}
                        currentCheckedItems={userGroups}
                        onChange={handleChange}
                      />
                    ) : (
                      <DisplayMessage
                        customStyle={{ fontSize: 16 }}
                        altMessage="Access Denied"
                        image="./assets/access-denied.png"
                        heading="Access Denied"
                        description="Sorry, you are not allowed to view this page."
                      />
                    )}
                  </div>
                </div>
              </TabPanel>
            ) : (
              <CircularProgress sx={{ top: "208% !important" }} />
            )}
            <TabPanel value={value} index={1}>
              <PermissionCards
                userSelectedPermissions={userSelectedPermissions}
                setUserSelectedPermissions={setUserSelectedPermissions}
                groups={userGroups}
              />
            </TabPanel>
          </Box>
        </div>
      </div>
      <BottomFormController
        primarybuttonLabel={isEdit ? "Update User" : "Add User"}
        primaryButtonType="submit"
        formId="add-user-form"
        onSubmit={() => handleSubmit(onSubmitForm)()}
        onCancel={onBackNavigation}
        secondaryButtonLabel="Cancel"
      />
    </>
  );
};

export default UserForm;

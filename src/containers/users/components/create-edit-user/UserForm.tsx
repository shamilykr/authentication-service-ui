import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSetRecoilState } from "recoil";

import {
  GET_GROUPS,
  GET_GROUP_PERMISSIONS,
} from "../../../groups/services/queries";
import { ApolloError, useQuery } from "@apollo/client";
import FormInputText from "../../../../components/inputText";
import { ChecklistComponent } from "../../../../components/checklist/CheckList";
import { GET_USER, GET_USER_PERMISSIONS } from "../../services/queries";
import { Permission, User } from "../../../../types/user";
import "./styles.css";
import apolloClient from "../../../../services/apolloClient";
import { EntityPermissionsDetails } from "../../../../types/permission";
import { AddUserformSchema, EditUserformSchema } from "../../userSchema";
import PermissionCards from "../../../../components/permission-cards/PermissionCards";
import {
  apiRequestAtom,
  toastMessageAtom,
} from "../../../../states/apiRequestState";
import BottomFormController from "../../../../components/bottom-form-controller";
import { Group } from "../../../../types/group";

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
  const [groupPermissions, setGroupPermissions] = useState<
    EntityPermissionsDetails[]
  >([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [userSelectedPermissions, setUserSelectedPermissions] = useState<
    Permission[]
  >([]);
  const [status, setStatus] = useState<boolean>(false);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const setApiSuccess = useSetRecoilState(apiRequestAtom);

  useEffect(() => {
    if (
      (groupPermissions.length === 0 && !status) ||
      allGroups?.length === userGroups?.length
    ) {
      userGroups.forEach((group: Group) => {
        handlePermissions(group);
      });
    } // eslint-disable-next-line
  }, [userGroups]);

  const handlePermissions = async (group: Group) => {
    setStatus(true);
    try {
      const response = await apolloClient.query({
        query: GET_GROUP_PERMISSIONS,
        variables: {
          id: group.id,
        },
      });
      if (response) {
        if (!groupPermissions.some((groupObj) => groupObj.id === group.id))
          setGroupPermissions((previousState) => [
            ...previousState,
            {
              id: group.id,
              name: group.name,
              permissions: response?.data?.getGroupPermissions,
            },
          ]);
      }
    } catch (exception: ApolloError | any) {
      setToastMessage(exception.message);
      setApiSuccess(false);
    } finally {
      setStatus(false);
    }
  };

  const { data: groupData } = useQuery(GET_GROUPS, {
    onCompleted: (data) => {
      const groups = data?.getGroups.map((group: Group) => group);
      setAllGroups([...groups]);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
  });

  const { loading } = useQuery(GET_USER, {
    skip: !id,
    variables: { id: id },
    onCompleted: (data) => {
      setUser(data?.getUser);
      setUserGroups(data?.getUser.groups);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "network-only",
  });

  useQuery(GET_USER_PERMISSIONS, {
    skip: !id,
    variables: { id: id },
    onCompleted: (data) => {
      setUserSelectedPermissions(data?.getUserPermissions);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "network-only",
  });

  const methods = useForm({
    resolver: yupResolver(userformSchema),
  });

  const { handleSubmit } = methods;

  const onSubmitForm = (inputs: FieldValues) => {
    //TODO:waiting for backend fix
    // const isValidUser = mandatoryPermissions.some((mandatoryPermission) =>
    //   selectedPermissions.some(
    //     (permission) =>
    //       permission.name === mandatoryPermission ||
    //       getOverallPermissions(groupPermissions).some(
    //         (permission) => permission.name === mandatoryPermission
    //       )
    //   )
    // );
    // console.log(isValidUser);

    if (updateUser) updateUser(inputs, userGroups, userSelectedPermissions);
    else if (createUser)
      createUser(inputs, userGroups, userSelectedPermissions);
  };

  const removeGroup = (group: Group) => {
    setUserGroups(
      userGroups.filter((groupDetails) => groupDetails.id !== group.id)
    );
    setGroupPermissions(
      groupPermissions.filter((permission) => permission.id !== group.id)
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
          handlePermissions(group);
        }
      }
    } else {
      if (value === "all") {
        setUserGroups([]);
        setGroupPermissions([]);
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

  const mandatoryPermissions = ["view-user", "view-roles", "view-groups"];

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
                    label="Phone Number"
                    type="text"
                    className="fields three-items-row"
                  />
                </div>
              )}
            </div>
          </form>
        </FormProvider>
        <div>
          <Box>
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
            <TabPanel value={value} index={0}>
              <div id="groups-permissions">
                <div id="user-groups">
                  <ChecklistComponent
                    mapList={groupData?.getGroups}
                    currentCheckedItems={userGroups}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </TabPanel>
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

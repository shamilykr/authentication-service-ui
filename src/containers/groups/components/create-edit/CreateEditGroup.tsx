import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Tab, Tabs, Typography, Grid, Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { GET_ROLES } from "containers/roles/services/queries";
import {
  CREATE_GROUP,
  UPDATE_GROUP,
  UPDATE_GROUP_PERMISSIONS,
  UPDATE_GROUP_ROLES,
} from "../../services/mutations";
import {
  IsViewRolesVerifiedAtom,
  IsViewUsersVerifiedAtom,
} from "states/permissionsStates";
import AccessDenied from "components/access-denied";
import "./styles.css";
import GroupForm from "./GroupForm";
import { GET_GROUP, GET_GROUP_PERMISSIONS } from "../../services/queries";
import { Role } from "types/role";
import PermissionCards from "components/permission-cards/PermissionCards";
import { Permission, User } from "types/user";
import { Group } from "types/group";
import { allUsersAtom } from "states/userStates";
import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";
import {
  GROUP_CREATE_SUCCESS_MESSAGE,
  GROUP_UPDATE_SUCCESS_MESSAGE,
} from "constants/messages";
import RoleCardsChecklist from "components/role-cards-checklist/RoleCardsChecklist";
import { AvatarChecklistComponent } from "components/avatar-checklist/AvatarChecklist";
import { GET_USERS } from "containers/users/services/queries";
import { CustomAvatar } from "components/custom-avatar/CustomAvatar";
import { ReactComponent as CrossIcon } from "assets/cross-icon.svg";
import { useCustomQuery } from "hooks/useQuery";
import { useCustomMutation } from "hooks/useMutation";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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

const CreateOrEditGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const usersResponse = useRecoilValue(allUsersAtom);
  const [isViewRolesVerified] = useRecoilState(IsViewRolesVerifiedAtom);
  const [isViewUsersVerified] = useRecoilState(IsViewUsersVerifiedAtom);

  const [value, setValue] = useState(0);
  const [group, setGroup] = useState<Group>();
  const [roles, setRoles] = useState<Role[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>(usersResponse);

  const [users, setUsers] = useState<User[]>([]);

  const [allRoles, setAllRoles] = useState<Role[]>([]);

  const [userSelectedPermissions, setUserSelectedPermissions] = useState<
    Permission[]
  >([]);

  useEffect(() => {
    setAllUsers(usersResponse);
  }, [usersResponse]);
  const [updateGroup, { data: updatedGroupData }] =
    useCustomMutation(UPDATE_GROUP);
  const [createGroup, { data: createdGroupData }] =
    useCustomMutation(CREATE_GROUP);
  const [updateGroupRoles, { data: updatedGroupRolesData }] =
    useCustomMutation(UPDATE_GROUP_ROLES);
  const [updateGroupPermissions, { data: updatedGroupPermissionsData }] =
    useCustomMutation(UPDATE_GROUP_PERMISSIONS);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onGetRolesComplete = (data: any) => {
    setAllRoles(data?.getRoles);
  };

  const { data: roleData, loading: rolesLoading } = useCustomQuery(
    GET_ROLES,
    onGetRolesComplete,
    null,
    !isViewRolesVerified
  );

  const onGetGroupComplete = (data: any) => {
    setGroup(data?.getGroup);
    setRoles([...roles, ...data?.getGroup?.roles]);
    setUsers([...users, ...data?.getGroup?.users]);
  };
  const { loading } = useCustomQuery(
    GET_GROUP,
    onGetGroupComplete,
    { id: id },
    !id
  );

  const onGetGroupPermissionsComplete = (data: any) => {
    const permissionList = data?.getGroupPermissions;
    setUserSelectedPermissions(permissionList);
  };

  useCustomQuery(
    GET_GROUP_PERMISSIONS,
    onGetGroupPermissionsComplete,
    { id },
    !id
  );

  const removeItem = ({
    roleId,
    userId,
  }: {
    roleId?: string;
    userId?: string;
  }) => {
    if (roleId) {
      setRoles(roles.filter((role: Role) => role.id !== roleId));
    }

    if (userId) {
      setUsers(users.filter((user: User) => user.id !== userId));
    }
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    item?: Role
  ) => {
    const value = event.target.value;
    if (event.target.checked) {
      if (value === "all") {
        setRoles(allRoles);
        return;
      }
      if (item) {
        // handlePermissions(item);
        if (roles[0] === null) {
          setRoles([item]);
        } else {
          setRoles([...roles, item]);
        }
      }
    } else {
      if (value === "all") {
        setRoles([]);
        return;
      }
      removeItem({ roleId: item?.id as string });
    }
  };

  const onChangeUsers = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: User
  ) => {
    const value = event.target.value;

    if (event.target.checked) {
      if (value === "all") {
        setUsers(allUsers);
        return;
      }
      if (users[0] === null) {
        setUsers([item]);
      } else {
        setUsers([...users, item]);
      }
    } else {
      if (value === "all") {
        setUsers([]);
        return;
      }
      removeItem({ userId: item?.id as string });
    }
  };

  const onCreateGroup = (inputs: FieldValues) => {
    createGroup({
      variables: {
        input: inputs,
      },
    });
  };

  useEffect(() => {
    if (createdGroupData) {
      updateGroup({
        variables: {
          id: createdGroupData?.createGroup?.id,
          input: { users: users.map((user) => user.id) },
        },
      });

      updateGroupRoles({
        variables: {
          id: createdGroupData?.createGroup?.id,
          input: { roles: roles.map((role) => role.id) },
        },
      });

      updateGroupPermissions({
        variables: {
          id: createdGroupData?.createGroup?.id,
          input: {
            permissions: userSelectedPermissions.map(
              (permission) => permission.id
            ),
          },
        },
      });
    } // eslint-disable-next-line
  }, [createdGroupData]);

  useEffect(() => {
    if ((createdGroupData && updatedGroupData) || updatedGroupData) {
      if (updatedGroupRolesData && updatedGroupPermissionsData) {
        navigate("/home/groups");
        setApiSuccess(true);
        createdGroupData
          ? setToastMessage(GROUP_CREATE_SUCCESS_MESSAGE)
          : setToastMessage(GROUP_UPDATE_SUCCESS_MESSAGE);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    createdGroupData,
    updatedGroupData,
    updatedGroupRolesData,
    updatedGroupPermissionsData,
  ]);

  const onEditGroup = (inputs: FieldValues) => {
    updateGroup({
      variables: {
        id: id,
        input: { name: inputs.name, users: users.map((user) => user.id) },
      },
    });

    updateGroupRoles({
      variables: {
        id: id,
        input: { roles: roles.map((role) => role.id) },
      },
    });

    updateGroupPermissions({
      variables: {
        id: id,
        input: {
          permissions: userSelectedPermissions.map(
            (permission) => permission.id
          ),
        },
      },
    });
  };

  return (
    <div className="access-settings">
      {!loading && (
        <GroupForm
          name={group?.name as string}
          createGroup={onCreateGroup}
          editGroup={onEditGroup}
        />
      )}
      <div style={{ height: "55%" }}>
        <Box
          sx={{
            display: "flex",
            width: "98.7%",
            marginBottom: "20px",
          }}
        >
          <Tabs value={value} onChange={handleChange} className="custom-tabs">
            <Tab
              label="Roles"
              sx={{ textTransform: "none", fontSize: "18px" }}
            />
            <Tab
              label="Permissions"
              sx={{ textTransform: "none", fontSize: "18px" }}
            />
            <Tab
              label="Members"
              sx={{ textTransform: "none", fontSize: "18px" }}
            />
          </Tabs>
        </Box>
        {!rolesLoading ? (
          <TabPanel value={value} index={0}>
            <div className="roles-checklist">
              {isViewRolesVerified ? (
                <RoleCardsChecklist
                  roleList={roleData?.getRoles}
                  currentCheckedItems={roles}
                  onChange={onChange}
                />
              ) : (
                <AccessDenied customStyle={{ fontSize: 16 }} />
              )}
            </div>
          </TabPanel>
        ) : (
          <CircularProgress />
        )}
        <TabPanel value={value} index={1}>
          <PermissionCards
            userSelectedPermissions={userSelectedPermissions}
            roles={roles}
            setUserSelectedPermissions={setUserSelectedPermissions}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div className="add-members">
            {isViewUsersVerified ? (
              <Grid container spacing={1} width="100%">
                <Grid item xs={10} lg={5}>
                  <AvatarChecklistComponent
                    mapList={allUsers}
                    currentCheckedItems={users}
                    onChange={onChangeUsers}
                    setItemList={setAllUsers}
                    searchQuery={GET_USERS}
                  />
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ marginRight: 2 }}
                />
                <Grid item xs={10} lg={6.7}>
                  <div className="select-member-wrapper">Select Members</div>
                  <div className="selected-members">
                    {users.map((user, index) => (
                      <div
                        id={user?.id}
                        className="selected-items"
                        key={user?.id}
                      >
                        <CustomAvatar
                          firstName={user?.firstName}
                          lastName={user?.lastName}
                          email={user?.email}
                        />
                        <CrossIcon
                          className="cross-icon"
                          onClick={() =>
                            removeItem({ userId: user?.id as string })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </Grid>
              </Grid>
            ) : (
              <AccessDenied customStyle={{ fontSize: 16 }} />
            )}
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default CreateOrEditGroup;

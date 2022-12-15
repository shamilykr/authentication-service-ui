import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Checkbox } from "@mui/material";
import SquareIcon from "@mui/icons-material/Square";

import { ReactComponent as UnCheckedIcon } from "assets/icons/uncheckedicon.svg";
import { ReactComponent as CheckedIcon } from "assets/icons/checkedicon.svg";

import { Permission } from "types/permission";
import { Role } from "types/role";
import {
  getUniquePermissionsFromGroups,
  getUniquePermissionsFromRoles,
} from "utils/permissions";
import { Entity } from "types/generic";
import If from "../If/If";
import { RemovedPermissions } from "containers/permissions/constants";
import { Group } from "types/group";

interface PermissionCardProps {
  entity: Entity;
  roles?: Role[];
  groups?: Group[];
  userSelectedPermissions?: Permission[];
  setUserSelectedPermissions?: React.Dispatch<
    React.SetStateAction<Permission[]>
  >;
  userPermissions?: Permission[];
  isViewPage?: boolean;
}

const Container = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  width: 238px;
  height: fit-content;
  padding-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid #d2d5dd;
  border-radius: 6px;
  margin-top: 10px;
  font-family: "Manrope";
  padding-left: 10px;
  row-gap: 19px;
`;

const CollectionName = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-top: 10px;
`;
const CheckboxContainer = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  column-gap: 12px;
`;

const PermissionsCard: FC<PermissionCardProps> = ({
  entity,
  roles = [],
  groups = [],
  userSelectedPermissions = [],
  setUserSelectedPermissions = () => null,
  userPermissions = [],
  isViewPage = false,
}) => {
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [groupPermissions, setGroupPermissions] = useState<Permission[]>([]);

  const onChangePermissions = (
    e: React.ChangeEvent<HTMLInputElement>,
    permission: Permission
  ) => {
    if (e.target.checked) {
      setUserSelectedPermissions([...userSelectedPermissions, permission]);
    } else {
      const isUserSelectedPermission = !(
        rolePermissions.some(
          (rolePermission) => rolePermission.id === permission.id
        ) ||
        groupPermissions.some(
          (groupPermission) => groupPermission.id === permission.id
        )
      );
      if (isUserSelectedPermission)
        setUserSelectedPermissions(
          userSelectedPermissions.filter(
            (userSelectedPermission) =>
              userSelectedPermission.id !== permission.id
          )
        );
    }
  };

  useEffect(() => {
    setRolePermissions(getUniquePermissionsFromRoles(roles));
    setGroupPermissions(getUniquePermissionsFromGroups(groups));
  }, []);

  const IsChecked = (id: string) => {
    return (
      rolePermissions.some((permission) => permission.id === id) ||
      groupPermissions.some((permission) => permission.id === id) ||
      userSelectedPermissions.some((permission) => permission.id === id)
    );
  };

  const IsUserPermission = (id: string): boolean => {
    return userPermissions.some((userPermission) => userPermission.id === id);
  };

  const showEntityPermissions = (): boolean => {
    const filteredArray = entity.permissions.filter((item1) =>
      userPermissions.some(
        (item2) => item2.id === item1.id && item2.name === item1.name
      )
    );
    if (isViewPage) return filteredArray.length !== 0;
    return true;
  };

  return (
    <Container show={showEntityPermissions()}>
      <CollectionName>{entity.name}</CollectionName>
      {entity.permissions.map((permission) => (
        <If condition={!RemovedPermissions.includes(permission.name)}>
          <If condition={isViewPage && IsUserPermission(permission.id)}>
            <CheckboxContainer>
              <SquareIcon sx={{ width: 10, fill: "#2F6FED" }} />
              <div>{permission.label ?? permission.name}</div>
            </CheckboxContainer>
          </If>
          <If condition={!isViewPage}>
            <CheckboxContainer>
              <Checkbox
                value={"all"}
                className="custom-checkbox"
                onChange={(e) => onChangePermissions(e, permission)}
                checked={IsChecked(permission.id)}
                icon={<UnCheckedIcon />}
                checkedIcon={<CheckedIcon />}
              />
              <div>{permission.label ?? permission.name}</div>
            </CheckboxContainer>
          </If>
        </If>
      ))}
    </Container>
  );
};

export default PermissionsCard;

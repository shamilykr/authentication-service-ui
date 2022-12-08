import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Checkbox } from "@mui/material";
import { ReactComponent as UnCheckedIcon } from "../../assets/icons/uncheckedicon.svg";
import { ReactComponent as CheckedIcon } from "../../assets/icons/checkedicon.svg";

import { Permission } from "../../types/permission";
import { Role } from "../../types/role";
import {
  getUniquePermissionsFromGroups,
  getUniquePermissionsFromRoles,
} from "../../utils/permissions";
import { Entity } from "../../types/generic";
import If from "../If/If";
import { RemovedPermissions } from "../../containers/permissions/constants";
import { Group } from "../../types/group";

interface PermissionCardProps {
  roles?: Role[];
  groups?: Group[];
  userSelectedPermissions: Permission[];
  entity: Entity;
  setUserSelectedPermissions?: React.Dispatch<
    React.SetStateAction<Permission[]>
  >;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 238px;
  height: 206px;
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
  roles = [],
  groups = [],
  userSelectedPermissions,
  entity,
  setUserSelectedPermissions = () => null,
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
  }, []);

  useEffect(() => {
    setGroupPermissions(getUniquePermissionsFromGroups(groups));
  }, []);

  const IsChecked = (id: string) => {
    return (
      rolePermissions.some((permission) => permission.id === id) ||
      groupPermissions.some((permission) => permission.id === id) ||
      userSelectedPermissions.some((permission) => permission.id === id)
    );
  };

  return (
    <Container>
      <CollectionName>{entity.name}</CollectionName>
      {entity.permissions.map((permission) => (
        <If condition={!RemovedPermissions.includes(permission.name)}>
          <CheckboxContainer>
            <Checkbox
              value={"all"}
              className="custom-checkbox"
              onChange={(e) => onChangePermissions(e, permission)}
              checked={IsChecked(permission.id)}
              icon={<UnCheckedIcon />}
              checkedIcon={<CheckedIcon />}
            />
            <div>{permission.name}</div>
          </CheckboxContainer>
        </If>
      ))}
    </Container>
  );
};

export default PermissionsCard;

import { Group } from "../types/group";
import { EntityPermissionsDetails, Permission } from "../types/permission";
import { Role } from "../types/role";

export const getOverallPermissions = (
  permissions: EntityPermissionsDetails[]
) => {
  const permissionsList = permissions.reduce((acc: Permission[], cur) => {
    acc.push(...cur.permissions);
    return acc;
  }, []);
  return [
    ...Array.from(
      new Set(permissionsList.map((permission: any) => permission.name))
    ),
  ];
};

export const getUniquePermissionsFromRoles = (roles: Role[]) => {
  const permissionsList = roles?.reduce((acc: Permission[], cur) => {
    acc.push(...cur.permissions);
    return acc;
  }, []);
  return [
    ...Array.from(
      new Set(permissionsList?.map((permission: any) => permission))
    ),
  ];
};

export const getUniquePermissionsFromGroups = (groups: Group[]) => {
  const permissionsList = groups?.reduce((acc: Permission[], cur) => {
    acc.push(...cur.allPermissions);
    return acc;
  }, []);
  return [
    ...Array.from(
      new Set(permissionsList?.map((permission: any) => permission))
    ),
  ];
};

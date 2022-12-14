import { atom } from "recoil";
import { Permission, userPermission } from "types/user";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const permissionsListAtom = atom<Permission[]>({
  key: "PermissionsList",
  default: [],
});

export const GroupPermissionsAtom = atom<Permission[]>({
  key: "GroupPermissionsList",
  default: [],
});

export const RolePermissionsAtom = atom<Permission[]>({
  key: "RolePermissions",
  default: [],
});

export const UserPermissionsAtom = atom<userPermission[]>({
  key: "UserPermissions",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const IsViewUsersVerifiedAtom = atom<boolean>({
  key: "IsViewUsersVerifiedAtom",
  default: false,
});

export const IsViewGroupsVerifiedAtom = atom<boolean>({
  key: "IsViewGroupsVerifiedAtom",
  default: false,
});

export const IsViewRolesVerifiedAtom = atom<boolean>({
  key: "IsViewRolesVerifiedAtom",
  default: false,
});

export const IsViewPermissionsVerifiedAtom = atom<boolean>({
  key: "IsViewPermissionsVerifiedAtom",
  default: false,
});

export const IsViewEntitiesVerifiedAtom = atom<boolean>({
  key: "IsViewEntitiesVerifiedAtom",
  default: false,
});

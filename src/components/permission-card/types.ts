import { Entity } from "types/generic";
import { Group } from "types/group";
import { Permission } from "types/permission";
import { Role } from "types/role";

export interface PermissionCardProps {
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

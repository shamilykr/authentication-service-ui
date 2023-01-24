import { Group } from "types/group";
import { Permission } from "types/permission";
import { Role } from "types/role";

export interface PermissionCardsProps {
  userSelectedPermissions?: Permission[];
  roles?: Role[];
  groups?: Group[];
  setUserSelectedPermissions?: React.Dispatch<
    React.SetStateAction<Permission[]>
  >;
  userPermissions?: Permission[];
  isViewPage?: boolean;
}

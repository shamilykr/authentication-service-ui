import { Permission } from "./permission";
import { Role } from "./role";
import { User } from "./user";

export interface Group {
  id: string;
  name: string;
  users?: User[];
  roles?: Role[];
  permissions: Permission[];
  allPermissions: Permission[];
}

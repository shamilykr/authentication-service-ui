import { Group } from "./group";

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  middleName: string;
  lastName: string;
  status: string;
  groups?: Group[];
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  name: string;
}

export interface userPermission {
  name: string;
  __typename: string;
}

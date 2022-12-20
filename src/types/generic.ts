import { Permission } from "./permission";

export interface NewEntity {
  name: string;
}

export interface Entity {
  id: string;
  name: string;
  permissions: EntityPermission[];
}

export interface EntityPermission {
  id: string;
  name: string;
  label?: string;
}
export interface EntityPermissionsDetails {
  id: string;
  name: string;
  permissions: Permission[];
}

export enum Entities {
  USERS = "Users",
  GROUPS = "Groups",
  ROLES = "Roles",
}

export enum UpdateEntity {
  UPDATE_USER = "Update User",
  UPDATE_GROUP = "Update Group",
  UPDATE_ROLE = "Update Role",
}

export enum AddEntity {
  ADD_USER = "Add User",
  ADD_GROUP = "Add Group",
  ADD_ROLE = "Add Role",
  CREATE_USER = "Create User",
  CREATE_GROUP = "Create Group",
  CREATE_ROLE = "Create Role",
}

export enum SearchEntity {
  SEARCH_USER = "Search by First Name or Email",
  SEARCH_GROUP = "Search Group",
  SEARCH_ROLE = "Search Role",
}

export enum UserActions {
  LOGIN = "Login",
  LOGOUT = "Logout",
  SUBMIT = "Submit",
}

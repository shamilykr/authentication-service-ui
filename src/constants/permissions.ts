const CREATE_USER_PERMISSION = "create-user";
const CREATE_GROUP_PERMISSION = "create-groups";
const CREATE_ROLE_PERMISSION = "create-roles";
const UPDATE_USER_PERMISSION = "edit-user";
const UPDATE_GROUP_PERMISSION = "edit-groups";
const UPDATE_ROLE_PERMISSION = "edit-roles";
const DELETE_USER_PERMISSION = "delete-user";
const DELETE_GROUP_PERMISSION = "delete-groups";
const DELETE_ROLE_PERMISSION = "delete-roles";
const VIEW_USER_PERMISSION = "view-user";
const VIEW_GROUP_PERMISSION = "view-groups";
const VIEW_ROLE_PERMISSION = "view-roles";
const VIEW_ENTITY_PERMISSION = "view-entities";
const VIEW_PERMISSIONS_PERMISSION = "view-permissions";

const RemovedPermissions = [
  "create-permissions",
  "edit-permissions",
  "delete-permissions",
];

export {
  CREATE_USER_PERMISSION,
  CREATE_GROUP_PERMISSION,
  CREATE_ROLE_PERMISSION,
  UPDATE_USER_PERMISSION,
  UPDATE_GROUP_PERMISSION,
  UPDATE_ROLE_PERMISSION,
  DELETE_USER_PERMISSION,
  DELETE_GROUP_PERMISSION,
  DELETE_ROLE_PERMISSION,
  VIEW_USER_PERMISSION,
  VIEW_GROUP_PERMISSION,
  VIEW_ROLE_PERMISSION,
  VIEW_ENTITY_PERMISSION,
  VIEW_PERMISSIONS_PERMISSION,
  RemovedPermissions,
};

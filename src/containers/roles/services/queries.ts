import { gql } from "@apollo/client";

export const GET_ROLES = gql`
  query getRoles($search: RoleSearchInput, $sort: SortInput) {
    getRoles(input: { search: $search, sort: $sort }) {
      id
      name
      permissions {
        id
        name
        label
      }
    }
  }
`;

export const GET_ROLE = gql`
  query getRole($id: ID!) {
    getRole(id: $id) {
      id
      name
      permissions {
        id
        name
        label
      }
    }
  }
`;

export const GET_GROUP_ROLES = gql`
  query ($id: ID!) {
    getGroupRoles(id: $id) {
      id
      name
    }
  }
`;

export const GET_ROLE_PERMISSIONS = gql`
  query getRolePermissions($id: ID!) {
    getRolePermissions(id: $id) {
      id
      name
    }
  }
`;

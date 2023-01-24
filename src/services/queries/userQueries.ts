import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      phone
      firstName
      middleName
      lastName
      status
      groups {
        id
        name
        roles {
          id
          name
          permissions {
            id
            name
            label
          }
        }
        permissions {
          id
          name
          label
        }
        allPermissions {
          id
          name
          label
        }
      }
      permissions {
        id
        name
        label
      }
      inviteToken
    }
  }
`;

export const GET_USERS = gql`
  query getUsers(
    $search: UserSearchInput
    $filter: FilterInput
    $sort: SortInput
    $pagination: PaginationInput
  ) {
    getUsers(
      input: {
        search: $search
        filter: $filter
        sort: $sort
        pagination: $pagination
      }
    ) {
      totalCount
      results {
        id
        email
        firstName
        middleName
        lastName
        status
        groups {
          id
          name
        }
        inviteToken
      }
    }
  }
`;

export const GET_USER_GROUPS = gql`
  query ($id: ID!) {
    getUserGroups(id: $id) {
      id
      name
    }
  }
`;

export const GET_USER_PERMISSIONS = gql`
  query getUserPermissions($id: ID!) {
    getUserPermissions(id: $id) {
      id
      name
    }
  }
`;

export const VERIFY_USER_PERMISSION = gql`
  query ($params: UserPermissionsVerification!) {
    verifyUserPermission(params: $params)
  }
`;

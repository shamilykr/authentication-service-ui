import { gql } from "@apollo/client";

export const GET_GROUPS = gql`
  query getGroups(
    $search: GroupSearchInput
    $sort: SortInput
    $pagination: PaginationInput
  ) {
    getGroups(
      input: { search: $search, sort: $sort, pagination: $pagination }
    ) {
      totalCount
      results {
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
        users {
          firstName
          lastName
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
    }
  }
`;

export const GET_GROUP = gql`
  query getGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
      users {
        id
        email
        phone
        firstName
        middleName
        lastName
        status
      }
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
  }
`;

export const GET_GROUP_PERMISSIONS = gql`
  query getGroupPermissions($id: ID!) {
    getGroupPermissions(id: $id) {
      id
      name
    }
  }
`;

export const GET_GROUP_ROLES = gql`
  query getGroupRoles($id: ID!) {
    getGroupRoles(id: $id) {
      id
      name
    }
  }
`;

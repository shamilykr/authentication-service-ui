import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query getCurrentUser {
    getCurrentUser {
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
      permissions {
        id
        name
      }
      inviteToken
    }
  }
`;

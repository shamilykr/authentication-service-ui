import { gql } from "@apollo/client";

export const GET_ENTITIES = gql`
  query getEntities {
    getEntities {
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

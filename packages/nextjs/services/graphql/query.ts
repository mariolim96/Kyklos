import { gql } from "@apollo/client";

const getUserTokens = (userAddress: string) => {
    return gql`
    query GetUserTokenBalance {
      user(id: ${userAddress}) {
        id
        tokensOwned {
          id
          balance
          token {
            id
            name
            symbol
          }
        }
      }
    }
  `;
};

const getProject = (projectId: string) => gql`
query MyQuery {
  project(id: "${projectId}") {
    uri
    tx
    timestamp
    storageMethod
    standard
    region
    projectId
    methodology
    method
    id
    emissionType
    category
  }
}
`;

export { getUserTokens, getProject };

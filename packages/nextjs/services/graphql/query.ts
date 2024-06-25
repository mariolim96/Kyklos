import { gql } from "@apollo/client";

const getUserTokens = gql`
    query GetUserTokenBalance($address: ID!) {
        user(id: $address) {
            tokensOwned {
                id
                balance
                token {
                    id
                    name
                    symbol
                    projectVintage {
                        id
                        name
                        project {
                            projectId
                        }
                    }
                }
            }
        }
    }
`;
type UserTokenOwned = {
    id: string;
    balance: number;
    token: {
        id: string;
        name: string;
        symbol: string;
        projectVintage: {
            id: string;
            name: string;
            project: {
                projectId: string;
            };
        };
    };
};
type getUserTokensResponse = {
    user?: {
        tokensOwned: UserTokenOwned[];
    };
};

const getProjects = gql`
    query GetProjects {
        projects(first: 10) {
            id
            category
            emissionType
            method
            methodology
            projectId
            region
            standard
            storageMethod
            timestamp
            tx
            uri
        }
    }
`;

// const getUserRetirements = gql`
//     query allRetirement($id: ID!) {
//         user(id: $id) {
//             retirementsCreated {
//                 id
//                 amount
//                 creationTx
//                 eventId
//                 timestamp
//                 certificate {
//                     beneficiaryString
//                     createdAt
//                     creationTx
//                     retirementMessage
//                     retiringEntityString
//                     beneficiary {
//                         id
//                     }
//                 }
//             }
//         }
//     }
// `;
const getUserRetirements = gql`
    query allRetirement($id: ID = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266") {
        user(id: $id) {
            retirementsCreated {
                id
                amount
                timestamp
                token {
                    projectVintage {
                        project {
                            projectId
                            timestamp
                        }
                    }
                }
            }
        }
    }
`;
type userRetirements = {
    id: string;
    amount: number;
    timestamp: number;
    token: {
        projectVintage: {
            project: {
                projectId: string;
                timestamp: number;
            };
        };
    };
};
type getUserRetirementsType = {
    user?: {
        retirementsCreated: userRetirements[];
    };
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
const getRetirement = gql`
    query retirement($id: ID!) {
        retirement(id: $id) {
            amount
            eventId
            id
            creationTx
            certificate {
                beneficiaryString
                createdAt
                retirementMessage
                retiringEntityString
                creationTx
                beneficiary {
                    id
                }
            }
            token {
                projectVintage {
                    project {
                        projectId
                        category
                        standard
                    }
                }
                name
                id
            }
        }
    }
`;
type Retirement = {
    amount: number;
    eventId: string;
    id: string;
    creationTx: string;
    certificate: {
        beneficiaryString: string;
        createdAt: number;
        retirementMessage: string;
        retiringEntityString: string;
        creationTx: string;
        beneficiary: {
            id: string;
        };
    };
    token: {
        projectVintage: {
            project: {
                projectId: string;
                category: string;
                standard: string;
            };
        };
        name: string;
        id: string;
    };
};
type GetRetirementType = {
    retirement: Retirement;
};

const getAllUserRetirementCategoryAndAmount = gql`
    query allRetirement($id: ID!) {
        user(id: $id) {
            retirementsCreated {
                id
                amount
                token {
                    projectVintage {
                        project {
                            category
                        }
                    }
                }
            }
        }
    }
`;

type allRetirementCategoryAndAmount = {
    id: string;
    amount: number;
    token: {
        projectVintage: {
            project: {
                category: string;
            };
        };
    };
};

type getAllUserRetirementCategoryAndAmountType = {
    user?: {
        retirementsCreated: allRetirementCategoryAndAmount[];
    };
};

export {
    getUserTokens,
    getProjects,
    getUserRetirements,
    getProject,
    getRetirement,
    getAllUserRetirementCategoryAndAmount,
};
export type {
    getUserTokensResponse,
    UserTokenOwned,
    userRetirements,
    getUserRetirementsType,
    Retirement,
    GetRetirementType,
    allRetirementCategoryAndAmount,
    getAllUserRetirementCategoryAndAmountType,
};

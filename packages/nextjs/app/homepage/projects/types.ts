// [
//     {
//         "__typename": "Project",
//         "id": "1",
//         "category": "test category",
//         "emissionType": "test emission type",
//         "method": "test method",
//         "methodology": "test methodology",
//         "projectId": "test project id",
//         "region": "test region",
//         "standard": "test standard",
//         "storageMethod": "test storage method",
//         "timestamp": "1715162152",
//         "tx": null,
//         "uri": "test uri",
//         "owner": {
//             "__typename": "User",
//             "id": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
//         }
//     }
// ]
export interface Project {
    __typename: "Project";
    id: string;
    category: string;
    emissionType: string;
    method: string;
    methodology: string;
    projectId: string;
    region: string;
    standard: string;
    storageMethod: string;
    timestamp: string; // Assuming the timestamp is a string representation of a Unix timestamp
    tx: any; // Assuming all are null, otherwise need to define what `tx` type could be if not always null
    uri: string;
    owner: User;
}

interface User {
    __typename: "User";
    id: string;
}

export interface ProjectsData {
    projects: Project[];
}
export interface ProjectTableData {
    id: string;
    projectId: string;
    region: string;
    standard: string;
    category: string;
    //   pool: string;
}

// interface User {
//     id: string;
//     batchesOwned: BatchToken[];
//     batchesCreated: BatchToken[];
//     projectsOwned: Project[];
//     projectsCreated: Project[];
//     vintagesOwned: ProjectVintage[];
//     vintagesCreated: ProjectVintage[];
//     retirementsCreated: Retirement[];
//     tokensOwned: KCO2Balance[];
// }

// interface Project {
//     id: string;
//     creator: User;
//     owner: User;
//     timestamp: number;
//     tx: string | null;
//     projectId: string;
//     vintages: ProjectVintage[];
//     standard: string;
//     methodology: string;
//     region: string;
//     storageMethod: string;
//     method: string;
//     emissionType: string;
//     category: string;
//     uri: string;
// }

// interface ProjectVintage {
//     id: string;
//     creator: User;
//     owner: User;
//     timestamp: number;
//     tx: string;
//     name: string;
//     startTime: number;
//     endTime: number;
//     project: Project;
//     batches: BatchToken[];
//     totalVintageQuantity: number;
//     isCorsiaCompliant: boolean;
//     isCCCompliant: boolean;
//     coBenefits: string;
//     corresAdjustment: string;
//     additionalCertification: string;
//     kco2Token: KCO2Token;
// }

// interface BatchToken {
//     id: string;
//     creator: User;
//     owner: User;
//     timestamp: number;
//     vintage: ProjectVintage;
//     status: string;
//     tx: string;
// }

// interface KCO2Token {
//     id: string; // address
//     creator: User;
//     createdAt: number;
//     creationTx: string;
//     projectVintage: ProjectVintage;
//     name: string;
//     symbol: string;
//     retirements: Retirement[];
// }

// interface KCO2Balance {
//     id: string;
//     user: User;
//     token: KCO2Token;
//     balance: bigint;
// }

// interface RetirementCertificate {
//     id: string;
//     creationTx: string;
//     updateTxs: string[];
//     createdAt: bigint;
//     retiringEntity: User;
//     beneficiary: User;
//     retiringEntityString: string;
//     beneficiaryString: string;
//     retirementMessage: string;
//     retirements: Retirement[];
// }

// interface Retirement {
//     id: string;
//     creationTx: string;
//     amount: number;
//     timestamp: number;
//     token: KCO2Token;
//     creator: User;
//     eventId: number | null;
//     certificate: RetirementCertificate;
// }

// interface PooledKCO2Token {
//     id: string;
//     token: KCO2Token;
//     poolAddress: string;
//     amount: number;
// }

// interface Deposit {
//     id: string;
//     amount: number;
//     timestamp: number;
//     token: KCO2Token;
//     pool: string;
//     creator: User;
// }

// interface Redeem {
//     id: string;
//     amount: number;
//     timestamp: number;
//     token: KCO2Token;
//     pool: string;
//     creator: User;
// }

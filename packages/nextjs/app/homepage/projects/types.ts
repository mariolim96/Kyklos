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
interface Project {
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
  tx: null; // Assuming all are null, otherwise need to define what `tx` type could be if not always null
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
  projectId: string;
  region: string;
  standard: string;
  category: string;
  //   pool: string;
}

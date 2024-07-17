/* eslint-disable @typescript-eslint/ban-types */
// Scalars
type ID = string;
// type BigInt = number;

// User Entity
interface User {
    id?: ID;
    batchesOwned?: BatchToken[];
    batchesCreated?: BatchToken[];
    projectsOwned?: Project[];
    projectsCreated?: Project[];
    vintagesOwned?: ProjectVintage[];
    vintagesCreated?: ProjectVintage[];
    retirementsCreated?: Retirement[];
    redeemsCreated?: Redeem[];
    tokensOwned?: KCO2Balance[];
    poolBalances?: UserPoolBalance[];
}

// Project Entity
interface Project {
    id?: ID;
    creator?: User;
    owner?: User;
    timestamp?: BigInt;
    tx?: string | null;
    projectId?: string;
    vintages?: ProjectVintage[];
    standard?: string;
    methodology?: string;
    region?: string;
    storageMethod?: string;
    method?: string;
    emissionType?: string;
    category?: string;
    uri?: string;
}

// ProjectVintage Entity
interface ProjectVintage {
    id?: ID;
    creator?: User;
    owner?: User;
    timestamp?: BigInt;
    tx?: string;
    name?: string;
    startTime?: BigInt;
    endTime?: BigInt;
    project?: Project | null;
    batches?: BatchToken[];
    totalVintageQuantity?: BigInt;
    isCorsiaCompliant?: boolean;
    isCCCompliant?: boolean;
    coBenefits?: string;
    corresAdjustment?: string;
    additionalCertification?: string;
    kco2Token?: KCO2Token | null;
}

// BatchToken Entity
interface BatchToken {
    id?: ID;
    creator?: User;
    owner?: User;
    timestamp?: BigInt;
    vintage?: ProjectVintage;
    status?: string;
    tx?: string;
}

// KCO2Token Entity
interface KCO2Token {
    id?: ID; // address
    creator?: User;
    createdAt?: BigInt;
    creationTx?: string;
    projectVintage?: ProjectVintage;
    name?: string;
    symbol?: string;
    retirements?: Retirement[];
    // address?: string; // Uncomment if needed
}

// KCO2Balance Entity
interface KCO2Balance {
    id?: ID;
    user?: User;
    token?: KCO2Token;
    balance?: BigInt;
}

// RetirementCertificate Entity
interface RetirementCertificate {
    id?: ID;
    creationTx?: string;
    updateTxs?: string[];
    createdAt?: BigInt;
    retiringEntity?: User;
    beneficiary?: User;
    retiringEntityString?: string;
    beneficiaryString?: string;
    retirementMessage?: string;
    retirements?: Retirement[];
}

// Retirement Entity
interface Retirement {
    id?: ID;
    creationTx?: string;
    amount?: BigInt;
    timestamp?: BigInt;
    token?: KCO2Token;
    creator?: User;
    eventId?: BigInt | null;
    certificate?: RetirementCertificate | null;
}

// PooledKCO2Token Entity
interface PooledKCO2Token {
    id?: ID;
    token?: KCO2Token;
    poolAddress?: Pool;
    amount?: BigInt;
}

// Deposit Entity
interface Deposit {
    id?: ID;
    amount?: BigInt;
    timestamp?: BigInt;
    token?: KCO2Token;
    pool?: Pool;
    creator?: User;
}

// Redeem Entity
interface Redeem {
    id?: ID;
    amount?: BigInt;
    timestamp?: BigInt;
    token?: KCO2Token;
    pool?: Pool;
    creator?: User;
}

// UserPoolBalance Entity
interface UserPoolBalance {
    id?: ID;
    user?: User;
    pool?: Pool;
    balance?: BigInt;
}

// Pool Entity
interface Pool {
    id?: ID; // address
    name?: string | null;
    totalCarbonLocked?: BigInt;
    pooledTokens?: PooledKCO2Token[];
    poolBalances?: UserPoolBalance[];
    deposits?: Deposit[];
    redeems?: Redeem[];
}

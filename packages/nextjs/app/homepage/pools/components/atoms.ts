import { atom } from "jotai";

const price = atom("");
const selectedToken = atom(0);
const poolPrice = atom("");
const selectedPool = atom(0);

const info = atom<{
    name: string;
    wallet: `0x${string}`;
    retirementPerson: string;
    message: string;
}>({
    name: "orgs",
    wallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    retirementPerson: "mario",
    message: "fedeli autori",
});

export { price, poolPrice, selectedToken, selectedPool, info };

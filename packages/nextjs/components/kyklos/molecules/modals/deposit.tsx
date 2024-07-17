"use client";

import React from "react";
import MultistepModal from "../../organism/multistepModal";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { StepItem, useStepper } from "../../ui/stepper";
import { Text } from "../../ui/text";
import DefaultModal from "../defaultModal";
import PoolSwapper from "../poolsSwapper";
import CarbonTonneCard from "../swapper";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { price, selectedPool, selectedToken } from "~~/app/homepage/pools/components/atoms";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { usePoolInfo, useUserTokensAndBalance } from "~~/services/graphql/apis";
import { modalSelectors, modalsKeys } from "~~/services/store/modals";
import { tonneToKco } from "~~/utils/converter";

const steps = [{ label: "", id: "1", icon: () => <div>120</div> }] satisfies StepItem[];
const Modal = ({ id }: { id: modalsKeys; children?: React.ReactNode }) => {
    // const modalData = useModalStore(state => state.modals[id].meta);
    const { data } = useUserTokensAndBalance();
    const dataTokens = data?.user?.tokensOwned.map(userToken => {
        return {
            id: userToken.token.id,
            name: userToken.token.name.split(":")[1],
            balance: userToken.balance / 1e18,
        };
    });
    const { data: poolInfo } = usePoolInfo();
    const poolList = [
        {
            id: poolInfo?.pool.id ?? "0x00",
            name: "Carbon Tonne Pool",
            balance: (poolInfo?.pool?.totalCarbonLocked ?? 1) / 1e18,
        },
    ];
    const [tokenPrice, setPrice] = useAtom(price);
    const criterias = ["kyklos", "2021+"];

    // const [tokenPrice, setPrice] = useAtom(poolPrice);
    const [selectedPoolValue] = useAtom(selectedPool);
    return (
        <DefaultModal id={id}>
            <div className="bg-base  rounded-xl shadow-lg  w-[700px] h-fit overflow-hidden ">
                <MultistepModal
                    steps={steps}
                    footer={<Footer id={id} />}
                    views={[
                        <div key={1} className="p-4 h-[500px]">
                            <Text as="h2" element="h2" className="pl-[2px] text-overlay-content my-4">
                                Deposit
                            </Text>
                            <Text as="h5" element="h5" className="pl-[2px] text-base-content  font-semibold">
                                Token
                            </Text>
                            <Text as="h5" element="h5" className=" pl-[2px] text-base-content-2/45 mb-4">
                                select the KCO2 token and the amount you want to deposit into the pool.
                            </Text>
                            <CarbonTonneCard list={dataTokens ?? []} secondInput="Deposit KCO" />
                            <Text as="h5" element="h5" className="pl-[2px] text-base-content  mt-4 font-semibold">
                                Carbon pool
                            </Text>
                            <Text as="h5" element="h5" className=" pl-[2px] text-base-content-2/45 mb-4">
                                select the carbon pool you want to deposit the KCO2 token into.
                            </Text>
                            <div className=" z-50 ">
                                <PoolSwapper
                                    list={poolList ?? []}
                                    secondInput="Receiving KCT"
                                    value={tokenPrice}
                                    setValue={setPrice}
                                    selectedValue={selectedPoolValue}
                                />
                            </div>
                            <div className="bg-overlay text-overlay-content rounded-md mt-[-12px] p-4 py-2 z-0  flex justify-between">
                                <span>Pool criterias</span>
                                <div className="flex gap-2">
                                    {criterias.map((criteria, id) => (
                                        <Badge variant={"secondary"} key={id}>
                                            {criteria}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>,
                    ]}
                />
            </div>
        </DefaultModal>
    );
};

const Footer = ({ id }: { id: modalsKeys }) => {
    const { nextStep, prevStep, resetSteps, isDisabledStep, hasCompletedAllSteps, isLastStep, isOptionalStep } =
        useStepper();
    // i need to setup the contract address here
    const [selectedPoolValue] = useAtom(selectedPool);
    const [tokenPrice] = useAtom(price);
    const bigIntPrice = BigInt(tonneToKco(tokenPrice));
    const [selectedValue] = useAtom(selectedToken);
    const { data } = useUserTokensAndBalance();
    const dataTokens = data?.user?.tokensOwned.map(userToken => {
        return {
            id: userToken.token.id,
            name: userToken.token.name.split(":")[1],
            balance: userToken.balance / 1e18,
        };
    });
    const { data: poolInfo } = usePoolInfo();
    const poolList = [
        {
            id: poolInfo?.pool.id ?? "0x00",
            name: "Carbon Tonne Pool",
            balance: (poolInfo?.pool?.totalCarbonLocked ?? 1) / 1e18,
        },
    ];
    const contractAddress: `0x${string}` = (dataTokens?.[selectedValue].id ?? "0x00") as `0x${string}`;
    const { writeContractAsync: writePool } = useScaffoldWriteContract("PoolP");
    const { writeContractAsync: writeToken } = useScaffoldWriteContract(
        "KyklosCarbonOffsets",
        undefined,
        contractAddress,
    );
    const poolAddress = poolList[selectedPoolValue].id as `0x${string}`;
    const nextStepHandler = async () => {
        if (isLastStep) {
            await writePool({
                functionName: "deposit",
                args: [contractAddress, bigIntPrice],
            });
            nextStep();
            return;
        }
        nextStep();
    };
    const approveHandler = async () => {
        await writeToken({
            functionName: "approve",
            args: [poolAddress, bigIntPrice],
        });
    };

    const closeModal = modalSelectors.use.closeModal();
    const handlePrevStep = () => {
        if (isDisabledStep) {
            closeModal(id);
            return;
        }
        prevStep();
    };

    return (
        <>
            {hasCompletedAllSteps && (
                // add slide out animation
                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="h-[500px] flex items-center justify-center align-middle">
                        <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
                    </div>
                </motion.div>
            )}
            <div className="w-full h-12 flex justify-end items-baseline gap-2 px-4">
                {hasCompletedAllSteps ? (
                    <Button size="sm" onClick={resetSteps}>
                        Reset
                    </Button>
                ) : (
                    <>
                        <Button onClick={handlePrevStep} size="lg" variant="secondary">
                            {!isDisabledStep ? "Go black" : "Cancel "}
                        </Button>
                        <Button size="lg" className="w-28" onClick={approveHandler}>
                            Approve
                        </Button>
                        <Button size="lg" className="w-28" onClick={nextStepHandler}>
                            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
                        </Button>
                    </>
                )}
            </div>
        </>
    );
};

export default Modal;

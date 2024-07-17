"use client";

import React from "react";
import MultistepModal from "../../organism/multistepModal";
import { Button } from "../../ui/button";
import { StepItem, useStepper } from "../../ui/stepper";
import { Text } from "../../ui/text";
import DefaultModal from "../defaultModal";
import Swapper, { List } from "../newSwapper";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { price, selectedTokenValue } from "~~/app/homepage/pools/components/atoms";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { usePoolPooledTokens } from "~~/services/graphql/apis";
import { modalSelectors, modalsKeys } from "~~/services/store/modals";
import { tonneToKco } from "~~/utils/converter";

const steps = [{ label: "", id: "1", icon: () => <div>120</div> }] satisfies StepItem[];
const Modal = ({ id }: { id: modalsKeys; children?: React.ReactNode }) => {
    const { data: poolPooledTokens } = usePoolPooledTokens();
    console.log("poolPooledTokens:", poolPooledTokens);
    // console.log("data:", data);
    const availableTokensToRedeem: List[] = (poolPooledTokens?.pool?.pooledTokens ?? []).map((pooledToken, index) => {
        return {
            id: `${index}`,
            title: pooledToken.token.symbol,
            balance: pooledToken.amount / 1e18,
            subtitle: `${pooledToken.amount / 1e18} KCO2`,
        };
    });
    const amountOfUserPooledTokens = Number(poolPooledTokens?.pool.poolBalances[0].balance ?? 0) / 1e18;
    const [selectedToken, setSelectedTokenValue] = useAtom(selectedTokenValue);
    const [amountValue, setAmountValue] = useAtom(price);
    const uniquePool: List[] = [
        {
            id: "0x00",
            title: "Carbon Tonne Pool",
            balance: amountOfUserPooledTokens,
            subtitle: `KCT (192.65 €)`,
        },
    ];

    return (
        <DefaultModal id={id}>
            <div className="bg-base  rounded-xl shadow-lg  w-[700px] h-fit overflow-hidden ">
                <MultistepModal
                    steps={steps}
                    footer={<Footer id={id} />}
                    views={[
                        <div key={1} className="p-4 h-[500px]">
                            <Text as="h2" element="h2" className="pl-[2px] text-overlay-content my-4">
                                Redeem
                            </Text>
                            <Text as="h5" element="h5" className="pl-[2px] text-base-content  font-semibold">
                                Token
                            </Text>
                            <Text as="h5" element="h5" className=" pl-[2px] text-base-content-2/45 mb-4">
                                select the KCO2 token and the amount you want to redeem from the pool.
                            </Text>
                            <Swapper
                                list={availableTokensToRedeem}
                                type="redeem"
                                value={amountValue}
                                setValue={setAmountValue}
                                setSelectedValue={setSelectedTokenValue}
                                selectedValue={selectedToken}
                            />
                            <Text as="h5" element="h5" className="pl-[2px] text-base-content  mt-4 font-semibold">
                                Carbon pool
                            </Text>
                            <Text as="h5" element="h5" className=" pl-[2px] text-base-content-2/45 mb-4">
                                select the carbon pool you want to deposit the KCO2 token into.
                            </Text>
                            <div className=" z-50 ">
                                <Swapper
                                    list={uniquePool}
                                    type="carbonPoolRedeem"
                                    isMonoElement
                                    value={amountValue}
                                    setValue={setAmountValue}
                                ></Swapper>
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

    const [selectedToken] = useAtom(selectedTokenValue);
    const { data: poolPooledTokens } = usePoolPooledTokens();
    const [amountValue] = useAtom(price);

    const dataTokens = poolPooledTokens?.pool.pooledTokens;
    const contractAddress: `0x${string}` = (dataTokens?.[Number(selectedToken)].id.split("-")[1] ??
        "0x00") as `0x${string}`;
    const { writeContractAsync: writePool } = useScaffoldWriteContract("PoolP");

    const bigIntPrice = BigInt(tonneToKco(amountValue));
    const nextStepHandler = async () => {
        if (isLastStep) {
            await writePool({
                functionName: "redeemOutMany",
                args: [[contractAddress], [bigIntPrice]],
            });
            nextStep();
            return;
        }
        nextStep();
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

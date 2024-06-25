"use client";

import React from "react";
import MultistepModal from "../../organism/multistepModal";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { StepItem, useStepper } from "../../ui/stepper";
import { Text } from "../../ui/text";
import DefaultModal from "../defaultModal";
import CarbonTonneCard from "../swapper";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { FiArrowUpRight } from "react-icons/fi";
import { GrCertificate } from "react-icons/gr";
import { LuTreePine } from "react-icons/lu";
import { price, selectedToken } from "~~/app/homepage/pools/components/atoms";
import { useUserTokensAndBalance } from "~~/services/graphql/apis";
import { modalsKeys } from "~~/services/store/modals";

const steps = [
    { label: "Step 1", id: "1", icon: () => <div>120</div> },
    { label: "Step 2", icon: () => <div>120</div> },
] satisfies StepItem[];
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
    console.log("data:", dataTokens);
    const [selectedValue] = useAtom(selectedToken);
    const [tokenPrice] = useAtom(price);
    const selectedTokenData = data?.user?.tokensOwned[selectedValue];
    return (
        <DefaultModal id={id}>
            <div className="bg-base  rounded-xl shadow-lg  w-[700px] h-fit overflow-hidden ">
                <MultistepModal
                    steps={steps}
                    footer={<Footer />}
                    views={[
                        <div key={1} className="p-4 h-[500px]">
                            <Text as="h2" element="h2" className="pl-[1px] text-overlay-content my-4">
                                Retire carbon credits
                            </Text>
                            <Text as="h5" element="h5" className="pl-[1px] text-base-content  font-semibold">
                                Token retirement
                            </Text>
                            <Text as="h5" element="h5" className="text-base-content-2/45 mb-4">
                                select the token and the amount of carbon credits you want to retire
                            </Text>
                            <CarbonTonneCard list={dataTokens ?? []} />
                            <div className="bg-overlay rounded-md mt-6 p-4 ">
                                <Text as="h4" element="h4" className="text-overlay-content-2">
                                    Summary
                                </Text>
                                <div className="flex justify-between items-center pl-2">
                                    <div className="flex justify-start items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-overlay-2  flex items-center justify-center align-baseline">
                                            <LuTreePine className="inline  text-overlay-content-2" />
                                        </div>
                                        <Text as="h5" element="h5" className="text-overlay-content-2">
                                            Project name
                                        </Text>
                                    </div>
                                    <Text as="h5" element="p" className="text-overlay-content-2">
                                        {selectedTokenData?.token.projectVintage.project.projectId}
                                    </Text>
                                </div>
                                <div className="flex justify-between items-center pl-2">
                                    <div className="flex justify-start items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-overlay-2  flex items-center justify-center align-baseline">
                                            <GrCertificate className="inline  text-overlay-content-2" />
                                        </div>
                                        <Text as="h5" element="h5" className="text-overlay-content-2">
                                            Vintage
                                        </Text>
                                    </div>
                                    <Text as="h5" element="h5" className="text-overlay-content-2">
                                        {selectedTokenData?.token.projectVintage.name}
                                    </Text>
                                </div>
                                <Separator className="m-2 my-4" />
                                <div className="flex justify-between items-center pl-2">
                                    <div className="flex justify-start items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-overlay-2  flex items-center justify-center align-baseline">
                                            <FiArrowUpRight className="inline  text-overlay-content-2" />
                                        </div>
                                        <Text as="h5" element="h5" className="text-overlay-content-2 font-semibold">
                                            Total KCO compensated
                                        </Text>
                                    </div>
                                    <Text as="h5" element="h5" className="text-overlay-content-2">
                                        {tokenPrice || "0.0"} kCO2
                                    </Text>
                                </div>
                            </div>
                        </div>,
                        <div key={2} className="p-4 h-[500px]">
                            <Text as="h2" element="h2" className="pl-[1px] text-overlay-content my-4">
                                Retire carbon credits
                            </Text>
                            <Text as="h5" element="h5" className="pl-[1px] text-base-content  font-semibold">
                                Token retirement
                            </Text>
                            <Text as="h5" element="h5" className="text-base-content-2/45 mb-4">
                                select the token and the amount of carbon credits you want to retire
                            </Text>
                            <CarbonTonneCard list={dataTokens ?? []} />
                            <div className="bg-overlay rounded-md mt-6 p-4 ">
                                <Text as="h4" element="h4" className="text-overlay-content-2">
                                    Summary
                                </Text>
                                <div className="flex justify-between items-center pl-2">
                                    <div className="flex justify-start items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-overlay-2  flex items-center justify-center align-baseline">
                                            <LuTreePine className="inline  text-overlay-content-2" />
                                        </div>
                                        <Text as="h5" element="h5" className="text-overlay-content-2">
                                            Project name
                                        </Text>
                                    </div>
                                    <Text as="h5" element="p" className="text-overlay-content-2">
                                        {selectedTokenData?.token.projectVintage.project.projectId}
                                    </Text>
                                </div>
                                <div className="flex justify-between items-center pl-2">
                                    <div className="flex justify-start items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-overlay-2  flex items-center justify-center align-baseline">
                                            <GrCertificate className="inline  text-overlay-content-2" />
                                        </div>
                                        <Text as="h5" element="h5" className="text-overlay-content-2">
                                            Vintage
                                        </Text>
                                    </div>
                                    <Text as="h5" element="h5" className="text-overlay-content-2">
                                        {selectedTokenData?.token.projectVintage.name}
                                    </Text>
                                </div>
                                <Separator className="m-2 my-4" />
                                <div className="flex justify-between items-center pl-2">
                                    <div className="flex justify-start items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-overlay-2  flex items-center justify-center align-baseline">
                                            <FiArrowUpRight className="inline  text-overlay-content-2" />
                                        </div>
                                        <Text as="h5" element="h5" className="text-overlay-content-2 font-semibold">
                                            Total KCO compensated
                                        </Text>
                                    </div>
                                    <Text as="h5" element="h5" className="text-overlay-content-2">
                                        {tokenPrice || "0.0"} kCO2
                                    </Text>
                                </div>
                            </div>
                        </div>,
                        <div key={1} className="p-4 h-[500px]">
                            <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
                        </div>,
                    ]}
                />
            </div>
        </DefaultModal>
    );
};

const Footer = () => {
    const { nextStep, prevStep, resetSteps, isDisabledStep, hasCompletedAllSteps, isLastStep, isOptionalStep } =
        useStepper();
    console.log("hasCompletedAllSteps:", hasCompletedAllSteps);
    return (
        <>
            {hasCompletedAllSteps && (
                // add slide out animation
                <motion.div
                    className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
                </motion.div>
            )}
            <div className="w-full flex justify-end gap-2">
                {hasCompletedAllSteps ? (
                    <Button size="sm" onClick={resetSteps}>
                        Reset
                    </Button>
                ) : (
                    <>
                        <Button disabled={isDisabledStep} onClick={prevStep} size="sm" variant="secondary">
                            Prev
                        </Button>
                        <Button size="sm" onClick={nextStep}>
                            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
                        </Button>
                    </>
                )}
            </div>
        </>
    );
};

export default Modal;

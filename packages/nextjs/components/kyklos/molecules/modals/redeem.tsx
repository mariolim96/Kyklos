"use client";

import React from "react";
import MultistepModal from "../../organism/multistepModal";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { StepItem, useStepper } from "../../ui/stepper";
import { Text } from "../../ui/text";
import { Textarea } from "../../ui/textarea";
import DefaultModal from "../defaultModal";
import CarbonTonneCard from "../swapper";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { FiArrowUpRight } from "react-icons/fi";
import { GrCertificate } from "react-icons/gr";
import { LuTreePine } from "react-icons/lu";
import { useAccount } from "wagmi";
import { info, price, selectedToken } from "~~/app/homepage/pools/components/atoms";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useUserTokensAndBalance } from "~~/services/graphql/apis";
import { modalSelectors, modalsKeys } from "~~/services/store/modals";
import { tonneToKco } from "~~/utils/converter";

const steps = [
    { label: "SelectProject", id: "1", icon: () => <div>120</div> },
    { label: "Add info", icon: () => <div>120</div> },
] satisfies StepItem[];
const Modal = ({ id }: { id: modalsKeys; children?: React.ReactNode }) => {
    // const modalData = useModalStore(state => state.modals[id].meta);
    const { data } = useUserTokensAndBalance();
    console.log("data:", data);
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
    const [infos, setInfos] = useAtom(info);
    console.log("infos:", infos);
    const selectedTokenData = data?.user?.tokensOwned[selectedValue];
    return (
        <DefaultModal id={id}>
            <div className="bg-base  rounded-xl shadow-lg  w-[700px] h-fit overflow-hidden ">
                <MultistepModal
                    steps={steps}
                    footer={<Footer id={id} />}
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
                                Add information
                            </Text>
                            <div className="flex flex-col gap-8 items-center justify-around">
                                <div className="grid w-full items-center gap-1.5">
                                    <Label className="text-overlay-content-2" htmlFor="Name">
                                        Name/Organization
                                    </Label>
                                    <Input
                                        type="text"
                                        id="Name"
                                        placeholder="Enter name/organization"
                                        value={infos.name}
                                        onChange={e => {
                                            setInfos({ ...infos, name: e.target.value });
                                        }}
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label className="text-overlay-content-2" htmlFor="wallet">
                                        Wallet address
                                    </Label>
                                    <Input
                                        type="text"
                                        id="wallet"
                                        placeholder="Enter wallet address"
                                        value={infos.wallet}
                                        onChange={e => {
                                            setInfos({ ...infos, wallet: e.target.value as `0x${string}` });
                                        }}
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label className="text-overlay-content-2" htmlFor="retirementPerson">
                                        retirement person
                                    </Label>
                                    <Input
                                        type="text"
                                        id="retirementPerson"
                                        placeholder="Email"
                                        value={infos.retirementPerson}
                                        onChange={e => {
                                            setInfos({ ...infos, retirementPerson: e.target.value });
                                        }}
                                    />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label className="text-overlay-content-2" htmlFor="message">
                                        Your message
                                    </Label>
                                    <Textarea
                                        placeholder="Type your message here."
                                        id="message"
                                        value={infos.message}
                                        onChange={e => {
                                            setInfos({ ...infos, message: e.target.value });
                                        }}
                                    />
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
    console.log("hasCompletedAllSteps:", hasCompletedAllSteps);
    // i need to setup the contract address here
    const [infos] = useAtom(info);
    const [tokenPrice] = useAtom(price);
    const bigIntPrice = BigInt(tonneToKco(tokenPrice));
    const [selectedValue] = useAtom(selectedToken);
    console.log("selectedValue:", selectedValue);
    const { data } = useUserTokensAndBalance();
    console.log("data:", data);
    const dataTokens = data?.user?.tokensOwned.map(userToken => {
        return {
            id: userToken.token.id,
            name: userToken.token.name.split(":")[1],
            balance: userToken.balance / 1e18,
        };
    });
    const { address: account } = useAccount();
    const contractAddress: `0x${string}` = (dataTokens?.[selectedValue].id ?? "0x00") as `0x${string}`;
    const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract(
        "KyklosCarbonOffsets",
        undefined,
        contractAddress,
    );
    const c = useScaffoldReadContract({
        contractName: "KyklosCarbonOffsets",
        contractAddress: contractAddress,
        functionName: "balanceOf",
        args: [account ?? "0x00"],
    });
    console.log("c:", c.data);
    const nextStepHandler = async () => {
        if (isLastStep) {
            await writeYourContractAsync({
                functionName: "retireAndMintCertificate",
                args: [infos.name ?? "", infos.wallet, infos.retirementPerson, infos.message, bigIntPrice],
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

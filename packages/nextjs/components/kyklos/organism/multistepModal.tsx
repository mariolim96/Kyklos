"use client";

import React from "react";
import { Button } from "../ui/button";
import { Step, StepItem, Stepper, useStepper } from "../ui/stepper";
import { motion } from "framer-motion";

interface Props {
    steps: StepItem[];
    views: React.ReactNode[];
    initialStep?: number;
    footer?: React.ReactNode;
}

const MultistepModal = ({ steps, initialStep, views, footer }: Props) => {
    const { activeStep } = useStepper();

    return (
        <div className="flex w-full flex-col gap-4">
            <Stepper
                initialStep={initialStep ?? 0}
                steps={steps}
                variant="line"
                orientation="horizontal"
                checkIcon={steps[activeStep].icon}
                styles={{
                    "horizontal-step":
                        "bg-success border-b-4 border-t-0 justify-center first:rounded-tl-lg last:rounded-tr-lg",
                    "main-container": "gap-0 h-16",
                    "horizontal-step-container": " justify-center",
                    "step-label": "text-primary text-[1rem] font-semibold",
                }}
            >
                {steps.map((stepProps, index) => {
                    return (
                        <Step key={stepProps.label} {...stepProps}>
                            <div className="flex flex-col">
                                <motion.div
                                    className="flex-1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {views[index]}
                                </motion.div>
                            </div>
                        </Step>
                    );
                })}
                {footer ?? <Footer />}
            </Stepper>
        </div>
    );
};

export default MultistepModal;

const Footer = () => {
    const { nextStep, prevStep, resetSteps, isDisabledStep, hasCompletedAllSteps, isLastStep, isOptionalStep } =
        useStepper();
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

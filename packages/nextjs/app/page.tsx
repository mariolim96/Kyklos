"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { NextPage } from "next";
import { DropdownMenuCheckboxes } from "~~/components/kyklos/molecules/checkboxMenu";
import InfoTab from "~~/components/kyklos/molecules/infoTab";
import StatusCard from "~~/components/kyklos/molecules/statusCard";
import MultistepModal from "~~/components/kyklos/organism/multistepModal";
import { Button } from "~~/components/kyklos/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/kyklos/ui/card";
import { Checkbox } from "~~/components/kyklos/ui/checkbox";
import { Input } from "~~/components/kyklos/ui/input";
import { Label } from "~~/components/kyklos/ui/label";
import Loader from "~~/components/kyklos/ui/loader";
import { Step, StepItem, Stepper, useStepper } from "~~/components/kyklos/ui/stepper";
import Text from "~~/components/kyklos/ui/text";

const Home: NextPage = () => {
    const [menuItems, setMenuItems] = React.useState([
        { label: "Status Bar", checked: true },
        { label: "Activity Bar", checked: false, disabled: true },
        { label: "Panel", checked: false },
    ]);

    const handleItemChange = (label: string, checked: boolean) => {
        setMenuItems(prevItems => prevItems.map(item => (item.label === label ? { ...item, checked } : item)));
    };
    //   router.push("/homepage");

    return (
        <>
            <Button>Click me</Button>
            <Button variant="destructive">Click me</Button>
            <Button variant="outline">Click me</Button>
            <Button variant="ghost">Click me</Button>
            <Button variant="secondary">Click me</Button>
            <Button variant="link">Click me</Button>

            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Name of your project" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="framework">Framework</Label>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Deploy</Button>
                </CardFooter>
            </Card>

            <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Accept terms and conditions
                </label>
            </div>
            <DropdownMenuCheckboxes items={menuItems} name={"hello"} onItemChange={handleItemChange} />

            <StatusCard title="Payments" header={<Button variant="outline">View all</Button>} />
            <Loader />
            <Text element="h1" as="h1">
                Hello World
            </Text>
            <Text element="h1" as="h1">
                Hello World
            </Text>
            <Text element="h1" as="h2">
                Hello World
            </Text>
            <Text element="h1" as="h3">
                Hello World
            </Text>
            <Text element="h1" as="h4">
                Hello World
            </Text>
            <Text element="h1" as="h5">
                Hello World
            </Text>
            <StepperDemo />
            <InfoTab image="/token.png" title="Welcome to Scaffold-ETH 2" subTitle="Scaffold-ETH 2 is a" />
            <MultistepModal
                steps={steps}
                footer={<Footer />}
                views={[<div key={1}>v1</div>, <div key={2}>v2</div>, <div key={3}>v3</div>]}
            />
        </>
    );
};

const steps = [
    { label: "Step 1", description: "desc", id: "1", icon: () => <div>120</div> },
    { label: "Step 2", icon: () => <div>120</div> },
    { label: "Step 3", icon: () => <div>120</div> },
] satisfies StepItem[];

function StepperDemo() {
    const { activeStep } = useStepper();
    return (
        <div className="flex w-full flex-col gap-4">
            <Stepper
                initialStep={0}
                steps={steps}
                variant="circle-alt"
                orientation="horizontal"
                checkIcon={steps[activeStep].icon}
            >
                {steps.map((stepProps, index) => {
                    return (
                        <Step key={stepProps.label} {...stepProps}>
                            <motion.div
                                className="h-40 w-[300px] flex items-center justify-center my-2 border bg-secondary text-primary rounded-md"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="text-xl">Step {index + 1}</h1>
                            </motion.div>
                        </Step>
                    );
                })}
                <Footer />
            </Stepper>
        </div>
    );
}

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

export default Home;
